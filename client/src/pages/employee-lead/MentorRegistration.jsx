import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerMentor,
  getPendingRequests,
  approveMenteeRequest,
  cancelMentorMenteeRelationship,
  getTopics,
  getMentorIdByEmployeeId
} from "../../api/employee-lead/mentorship";
import { getEmpLead, logout } from "../../api/employee-lead/auth";
import { unauthenticateUser } from "../../redux/slices/authSlice";
import Layout from "../../components/layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/MentorRegistration.css';

const MentorRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [requests, setRequests] = useState([]);
  const [mentor, setMentor] = useState({});
  const [mentorId, setMentorId] = useState(null); // Store mentor ID
  const [loading, setLoading] = useState(true);

  const logoutEmp = async () => {
    try {
      await logout();
      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      console.log("Error during logout:", error.response ? error.response.data : error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await getEmpLead();
      setMentor(data.user);
      const mentorResponse = await getMentorIdByEmployeeId(data.user.id); // Fetch mentor ID
      setMentorId(mentorResponse.data.mentor_id); // Store the mentor ID
    } catch (err) {
      console.log("Error fetching user data:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (mentorId) => {
    if (!mentorId) return;
    try {
      const { data } = await getPendingRequests(mentorId);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    async function fetchTopics() {
      const response = await getTopics();
      setTopics(response.data);
    }
    fetchTopics();
    fetchUser();
  }, []);

  useEffect(() => {
    fetchRequests(mentorId); // Fetch requests whenever mentorId changes
  }, [mentorId]);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleMentorRegistration = async () => {
    if (!selectedTopic) {
      alert("Please select a topic");
      return;
    }

    try {
      const response = await registerMentor(selectedTopic);
      setMentorId(response.data.mentor_id); // Store the mentor ID
      await fetchRequests(response.data.mentor_id); // Fetch requests using mentor ID
      alert("Registered as mentor successfully");
    } catch (error) {
      console.error("Error registering as mentor:", error.response ? error.response.data : error.message);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await approveMenteeRequest(requestId);
      await fetchRequests(mentorId); // Refresh requests using stored mentor ID
      alert("Request approved successfully");
    } catch (error) {
      console.error("Error approving request:", error.response ? error.response.data : error.message);
    }
  };

  const handleCancel = async (menteeId) => {
    try {
      await cancelMentorMenteeRelationship(mentorId, menteeId);
      await fetchRequests(mentorId); // Refresh requests using stored mentor ID
      alert("Relationship cancelled successfully");
    } catch (error) {
      console.error("Error cancelling relationship:", error.response ? error.response.data : error.message);
    }
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div className="mentor-registration-page">
      <Layout>
        <div className="container cnt-frm mt-5">
          <h2 className="text-center mb-4">Mentor Registration</h2>
          <div className="text-center mb-4">
            <button onClick={handleMentorRegistration} disabled={!!mentorId} className="btn btn-primary">
              I want to be a mentor
            </button>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="topicSelect">Select a topic:</label>
            <select id="topicSelect" onChange={handleTopicChange} value={selectedTopic} className="form-control">
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.topic}
                </option>
              ))}
            </select>
          </div>
          <h3 className="text-center mb-4">Pending Mentor Requests</h3>
          {requests.length === 0 ? (
            <p className="text-center">No pending requests</p>
          ) : (
            requests.map((request) => (
              <div key={request.request_id} className="card mb-3">
                <div className="card-body">
                  <p>
                    {request.name} {request.surname} - {request.topic}
                  </p>
                  <div className="text-center">
                    <button onClick={() => handleApprove(request.request_id)} className="btn btn-success mx-2">
                      Approve
                    </button>
                    <button onClick={() => handleCancel(request.mentee_id)} className="btn btn-danger mx-2">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Layout>
    </div>
  );
};

export default MentorRegistration;
