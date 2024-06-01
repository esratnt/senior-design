import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerMentee,
  getMenteeByEmployeeId,
  getMentorsByTopic,
  sendMentorRequest,
  getTopics
} from "../../api/employee/mentorship";
import { getEmployees, logout } from "../../api/employee/auth";
import { unauthenticateUser } from "../../redux/slices/authSlice";
import Layout from "../../components/layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/MenteeRegistration.css';

const MenteeRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [mentee, setMentee] = useState(null);

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
      const { data } = await getEmployees();
      setEmployee(data.user);
      await fetchMentee(data.user.id);
    } catch (err) {
      console.log("Error fetching user data:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentee = async (employeeId) => {
    try {
      const { data } = await getMenteeByEmployeeId(employeeId);
      setMentee(data);
    } catch (error) {
      console.error("Error fetching mentee:", error.response ? error.response.data : error.message);
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

  const handleTopicChange = async (event) => {
    const topicId = event.target.value;
    setSelectedTopic(topicId);
    const response = await getMentorsByTopic(topicId);
    setMentors(response.data);
  };

  const handleMenteeRegistration = async () => {
    if (!selectedTopic) {
      alert("Please select a topic");
      return;
    }

    try {
      await registerMentee(employee.id, selectedTopic);
      await fetchMentee(employee.id); 
      alert("Registered as mentee successfully");
    } catch (error) {
      console.error("Error registering as mentee:", error.response ? error.response.data : error.message);
    }
  };

  const handleSendRequest = async () => {
    if (selectedMentor && mentee) {
      try {
        await sendMentorRequest(selectedMentor, mentee.mentee_id);
        alert("Mentor request sent successfully");
      } catch (error) {
        console.error("Error sending mentor request:", error.response ? error.response.data : error.message);
      }
    } else {
      alert("Please select a mentor and register as a mentee first");
    }
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div className="mentee-registration-page">
      <Layout>
        <div className="container cnt-frm mt-5">
          <h2 className="text-center mb-4">Mentee Registration</h2>
          <div className="text-center mb-4">
            <button onClick={handleMenteeRegistration} disabled={!!mentee} className="btn btn-primary">
              I want to be a mentee
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
          <h3 className="text-center mb-4">Available Mentors</h3>
          {mentors.map((mentor) => (
            <div key={mentor.mentor_id} className="card mb-3">
              <div className="card-body">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`mentor${mentor.mentor_id}`}
                    name="mentor"
                    value={mentor.mentor_id}
                    onChange={() => setSelectedMentor(mentor.mentor_id)}
                  />
                  <label className="form-check-label" htmlFor={`mentor${mentor.mentor_id}`}>
                    {mentor.name} {mentor.surname}
                  </label>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center">
            <button onClick={handleSendRequest} className="btn btn-success">
              Send Mentor Request
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default MenteeRegistration;
