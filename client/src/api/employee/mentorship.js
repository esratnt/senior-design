import axios from "axios";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Register as mentee
export const registerMentee = async (employee_id, topic_id) => {
  return await axios.post(
    "http://localhost:7070/api/employee/mentorship/register-mentee",
    {
      employee_id,
      topic_id,
    }
  );
};

// Get mentors by topic
export const getMentorsByTopic = async (topic_id) => {
  return await axios.get(
    `http://localhost:7070/api/employee/mentorship/mentors/${topic_id}`
  );
};

// Send mentor request
export const sendMentorRequest = async (mentor_id, mentee_id) => {
  return await axios.post(
    "http://localhost:7070/api/employee/mentorship/send-request",
    {
      mentor_id,
      mentee_id,
    }
  );
};

// Get all topics
export const getTopics = async () => {
  return await axios.get("http://localhost:7070/api/employee/topics");
};

// Get mentee by employee_id
export const getMenteeByEmployeeId = async (employee_id) => {
  return await axios.get(
    `http://localhost:7070/api/employee/mentorship/mentee/${employee_id}`
  );
};

// Cancel mentor-mentee relationship
export const cancelMentorMenteeRelationship = async (mentor_id, mentee_id) => {
  return await axios.post(
    "http://localhost:7070/api/employee/mentorship/cancel-relationship",
    {
      mentor_id,
      mentee_id,
    }
  );
};
