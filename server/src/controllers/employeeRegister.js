const db = require("../db");
const { hash } = require("bcryptjs");

exports.empRegister = async (req, res) => {
  const {
    name,
    surname,
    email,
    password,
    phone,
    userrole,
    department,
    salary,
  } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await db.query(
      "INSERT INTO user_employee(name,surname,email, password,phone,userrole,department,salary) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)",
      [
        name,
        surname,
        email,
        hashedPassword,
        phone,
        userrole,
        department,
        salary,
      ]
    );

    return res.status(201).json({
      succes: true,
      message: "Employee registration is succesfull",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};
exports.getEmployee = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const { rows } = await db.query(
        "SELECT emp_id,name,surname,email,phone,userrole,department,salary FROM user_employee "
      );
      return res.status(200).json({
        info: "protected info",
        user: user,
        employees: rows,
      });
    } else {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
exports.getEmployeeById = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const empId = req.params.id;
      const { rows } = await db.query(
        `SELECT name, surname, email, phone, userrole, department, salary FROM user_employee WHERE emp_id = $1`,
        [empId]
      );

      return res.status(200).json({
        employees: rows[0],
      });
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
