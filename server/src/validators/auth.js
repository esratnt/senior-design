const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

// password
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Parola 6 ile 15 karakter olmalıdır.");

// email
const email = check("email")
  .isEmail()
  .withMessage("Lütfen geçerli bir email giriniz.");

// check if email exists
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * from user_hr WHERE email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Kayıtlı email bulunmaktadır.");
  }
});

// login validation
const loginFieldCheck = check("email").custom(async (value, { req }) => {
  let user = await db.query("SELECT * from user_hr WHERE email = $1", [value]);

  if (!user.rows.length) {
    user = await db.query("SELECT * from user_employee WHERE email = $1", [
      value,
    ]);

    if (!user.rows.length) {
      throw new Error("Email doesn't exist");
    }
  }

  const validPassword = await compare(req.body.password, user.rows[0].password);

  if (!validPassword) {
    throw new Error("Wrong Password");
  }
  req.user = user.rows[0];
});

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldCheck],
};
