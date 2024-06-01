const jwt = require("jsonwebtoken");
const { SECRET, USER_ROLES } = require("../constants");

exports.userAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

exports.adminHrAuth = (req, res, next) => {
  if (req.user.role !== USER_ROLES.ADMIN_HR) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.employeeLeadAuth = (req, res, next) => {
  if (req.user.role !== USER_ROLES.EMPLOYEE_LEAD) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.employeeAuth = (req, res, next) => {
  if (req.user.role !== USER_ROLES.EMPLOYEE) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
