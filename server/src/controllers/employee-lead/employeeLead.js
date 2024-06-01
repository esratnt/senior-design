const db = require("../../db");

exports.getEmpLeadInfo = async (req, res) => {
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

exports.protectedEmpLeads = async (req, res) => {
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

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Çıkış başarılı",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getEmployeeInfo = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const empLead = await db.query(
        "SELECT department FROM user_employee WHERE emp_id = $1 AND userrole = 'employee_lead'",
        [user.id]
      );

      if (empLead.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Employee Lead not found" });
      }

      const { department } = empLead.rows[0];

      const { rows } = await db.query(
        "SELECT name, surname, phone, userrole, department FROM user_employee WHERE department = $1 AND userrole = 'employee'",
        [department]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No employees found for this department",
        });
      }

      return res.status(200).json({
        success: true,
        employees: rows,
      });
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
