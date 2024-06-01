const { Router } = require("express");
const {
  getEmployeeInfo,
  protectedEmployee,
} = require("../controllers/employee/auth");
const { userAuth, employeeAuth } = require("../middlewares/auth-middleware");
const { logout } = require("../controllers/employee-lead/employeeLead");
const {
  listCategories,
  listVideosByCategory,
} = require("../controllers/employee/video");

const {
  registerMentee,
  getMentorsByTopic,
  sendMentorRequest,
  getMenteeByEmployeeId,
  cancelMentorMenteeRelationship,
} = require("../controllers/employee/mentorship");
const { getTopics } = require("../controllers/employee-lead/topics");

const router = Router();

router.get("/employees", userAuth, employeeAuth, getEmployeeInfo);
router.get("/logout", logout);
router.get("/protected", userAuth, employeeAuth, protectedEmployee);
router.get(
  "/video/:category/:subcategory?",
  userAuth,
  employeeAuth,
  listVideosByCategory
);
router.get("/categories", userAuth, employeeAuth, listCategories);

//mentorship routes
router.post(
  "/mentorship/register-mentee",
  userAuth,
  employeeAuth,
  registerMentee
);
router.get(
  "/mentorship/mentors/:topic_id",
  userAuth,
  employeeAuth,
  getMentorsByTopic
);
router.post(
  "/mentorship/send-request",
  userAuth,
  employeeAuth,
  sendMentorRequest
);
router.get("/topics", userAuth, employeeAuth, getTopics);
router.get(
  "/mentorship/mentee/:employee_id",
  userAuth,
  employeeAuth,
  getMenteeByEmployeeId
);
router.post(
  "/mentorship/cancel-relationship",
  userAuth,
  employeeAuth,
  cancelMentorMenteeRelationship
);
module.exports = router;
