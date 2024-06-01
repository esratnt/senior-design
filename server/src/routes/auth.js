const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  getUserInfo,
  postHours,
  zeroHour,
} = require("../controllers/auth");
const { registerValidation, loginValidation } = require("../validators/auth");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");
const { userAuth, adminHrAuth } = require("../middlewares/auth-middleware");
const { employeeRegisterValidation } = require("../validators/empValidation");
const {
  empRegister,
  getEmployee,
  getEmployeeById,
} = require("../controllers/employeeRegister");
const { postProduct } = require("../controllers/shop");

const router = Router();

router.get("/protected", userAuth, adminHrAuth, protected);
router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  userAuth,
  adminHrAuth,
  register
);

router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);
router.get("/get-users", userAuth, adminHrAuth, getUsers);
router.get("/get-user", userAuth, adminHrAuth, getUserInfo);
router.post("/hour", userAuth, adminHrAuth, validationMiddleware, postHours);
router.post(
  "/monthly-hour",
  userAuth,
  adminHrAuth,
  validationMiddleware,
  zeroHour
);
router.post(
  "/employee/register",
  userAuth,
  adminHrAuth,
  employeeRegisterValidation,
  validationMiddleware,
  empRegister
);
router.get("/get-employee", userAuth, adminHrAuth, getEmployee);
router.get("/employee-id/:id", userAuth, adminHrAuth, getEmployeeById);
router.post(
  "/product-register",
  userAuth,
  adminHrAuth,
  validationMiddleware,
  postProduct
);

module.exports = router;
