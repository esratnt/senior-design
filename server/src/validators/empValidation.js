const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

//password
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password should be 6 - 15 characters");

//email
const email = check("email").isEmail().withMessage("Please enter valid email");

//check if email exists
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * from user_employee WHERE email = $1",
    [value]
  );

  if (rows.length) {
    throw new Error("Kayıtlı email bulunmaktadır.");
  }
});

module.exports = {
  employeeRegisterValidation: [email, password, emailExists],
};
