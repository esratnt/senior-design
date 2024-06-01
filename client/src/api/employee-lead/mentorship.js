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

// Register as mentor
export const registerMentor = async (topic_id) => {
  return await axios.post(
    "http://localhost:7070/empl/mentorship/register-mentor",
    {
      topic_id,
    }
  );
};

// Get mentees by topic
export const getMenteesByTopic = async (topic_id) => {
  return await axios.get(
    `http://localhost:7070/empl/mentorship/mentees/${topic_id}`
  );
};

// Approve mentee request
export const approveMenteeRequest = async (request_id) => {
  return await axios.post(
    "http://localhost:7070/empl/mentorship/approve-request",
    {
      request_id,
    }
  );
};

// Get all topics
export const getTopics = async () => {
  return await axios.get("http://localhost:7070/empl/topics");
};

// Get mentors by topic
export const getMentorsByTopic = async (topic_id) => {
  return await axios.get(
    `http://localhost:7070/empl/mentorship/mentors/${topic_id}`
  );
};

// Register as mentee
export const registerMentee = async (employee_id, topic_id) => {
  return await axios.post(
    "http://localhost:7070/empl/mentorship/register-mentee",
    {
      employee_id,
      topic_id,
    }
  );
};

// Get mentee by employee_id
export const getMenteeByEmployeeId = async (employee_id) => {
  return await axios.get(
    `http://localhost:7070/empl/mentorship/mentee/${employee_id}`
  );
};

// Send mentor request
export const sendMentorRequest = async (mentor_id, mentee_id) => {
  return await axios.post(
    "http://localhost:7070/empl/mentorship/send-request",
    {
      mentor_id,
      mentee_id,
    }
  );
};

// Get pending requests for a mentor
export const getPendingRequests = async (mentor_id) => {
  return await axios.get(
    `http://localhost:7070/empl/mentorship/pending-requests/${mentor_id}`
  );
};

// Get mentor ID by employee ID
export const getMentorIdByEmployeeId = async (employee_id) => {
  return await axios.get(
    `http://localhost:7070/empl/mentorship/mentor-id/${employee_id}`
  );
};

export const cancelMentorMenteeRelationship = async (mentor_id, mentee_id) => {
  return await axios.post(
    "http://localhost:7070/api/employee-lead/mentorship/cancel-relationship",
    {
      mentor_id,
      mentee_id,
    }
  );
};
