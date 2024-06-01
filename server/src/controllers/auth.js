const db = require("../db");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT hr_id, email FROM user_hr");
    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await db.query(
      "INSERT INTO user_hr(name, surname, email, password) VALUES ($1, $2, $3, $4)",
      [name, surname, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "Kaydınız başarıyla tamamlanmıştır",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let result = await db.query("SELECT * FROM user_hr WHERE email = $1", [
      email,
    ]);
    let user = result.rows[0];
    let userRole = user ? "admin-hr" : null;

    if (!user) {
      result = await db.query("SELECT * FROM user_employee WHERE email = $1", [
        email,
      ]);
      user = result.rows[0];
      userRole = user ? user.userrole : null;
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.hr_id || user.emp_id,
      email: user.email,
      role: userRole,
      department: user.department,
    };
    console.log("user role is", user.userrole);
    const token = await sign(payload, SECRET, { expiresIn: "1h" });
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Giriş başarılı",
      role: payload.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
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

exports.getUserInfo = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const { rows } = await db.query(
        "SELECT name, surname, hours FROM user_hr WHERE hr_id = $1",
        [user.id]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const { name, surname, hours } = rows[0];

      return res.status(200).json({
        success: true,
        user: {
          ...user,
          name,
          surname,
          hours,
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

exports.postHours = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userID = req.user.id;
    const additionalHours = parseInt(req.body.hours, 10);

    const { rows } = await db.query(
      `SELECT hours FROM user_hr WHERE hr_id=$1`,
      [userID]
    );

    let currentHours = 0;

    if (rows.length > 0) {
      currentHours = parseInt(rows[0].hours, 10);
    }

    const newHours = currentHours + additionalHours;

    await db.query(`UPDATE user_hr SET hours = $1 WHERE hr_id=$2`, [
      newHours,
      userID,
    ]);

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.zeroHour = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userID = req.user.id;
    const newHours = 0;
    await db.query(`UPDATE user_hr SET hours = $1 WHERE hr_id=$2`, [
      newHours,
      userID,
    ]);
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
