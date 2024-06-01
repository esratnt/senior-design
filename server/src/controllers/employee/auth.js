const db = require("../../db");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../../constants");

exports.getEmployeeInfo = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const { rows } = await db.query(
        "SELECT name, surname, phone , userrole, department FROM user_employee WHERE emp_id = $1",
        [user.id]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const { name, surname, phone, userrole, department } = rows[0];

      return res.status(200).json({
        success: true,
        user: {
          ...user,
          name,
          surname,
          phone,
          userrole,
          department,
        },
      });
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
exports.protectedEmployee = async (req, res) => {
  try {
    return res.status(200).json({
      info: "protected info",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
