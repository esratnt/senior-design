const { Router } = require("express");
const {
  getEmployeeInfo,
  protectedEmpLeads,
  getEmpLeadInfo,
} = require("../controllers/employee-lead/employeeLead");
const { logout } = require("../controllers/auth");
const {
  upload,
  uploadVideo,
  listVideosByCategory,
  listCategories,
} = require("../controllers/employee-lead/video");
const {
  userAuth,
  employeeLeadAuth,
} = require("../middlewares/auth-middleware");
const {
  registerMentor,
  getMenteesByTopic,
  approveMentorRequest,
  getPendingRequests,
  getMentorIdByEmployeeId,
  cancelMentorMenteeRelationship,
} = require("../controllers/employee-lead/mentorship");
const { getTopics } = require("../controllers/employee-lead/topics");
const router = Router();

router.get("/logout", logout);
router.get("/protected", userAuth, employeeLeadAuth, protectedEmpLeads);
router.get("/get-user", userAuth, employeeLeadAuth, getEmpLeadInfo);
router.get("/get-employee", userAuth, employeeLeadAuth, getEmployeeInfo);
router.post("/video/upload", userAuth, employeeLeadAuth, upload, uploadVideo);
router.get(
  "/video/:category",
  userAuth,
  employeeLeadAuth,
  listVideosByCategory
);
router.get("/categories", userAuth, employeeLeadAuth, listCategories);

// Mentorship routes
router.post(
  "/mentorship/register-mentor",
  userAuth,
  employeeLeadAuth,
  registerMentor
);
router.get(
  "/mentorship/mentees/:topic_id",
  userAuth,
  employeeLeadAuth,
  getMenteesByTopic
);
router.post(
  "/mentorship/approve-request",
  userAuth,
  employeeLeadAuth,
  approveMentorRequest
);
router.get(
  "/mentorship/pending-requests/:mentor_id",
  userAuth,
  employeeLeadAuth,
  getPendingRequests
);
router.get(
  "/mentorship/mentor-id/:employee_id",
  userAuth,
  employeeLeadAuth,
  getMentorIdByEmployeeId
);
router.post(
  "/mentorship/cancel-relationship",
  userAuth,
  employeeLeadAuth,
  cancelMentorMenteeRelationship
);

router.get("/topics", userAuth, employeeLeadAuth, getTopics);

module.exports = router;
