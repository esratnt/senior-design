const db = require("../../db");

exports.registerMentor = async (req, res) => {
  const { topic_id } = req.body;
  const user_employee_id = req.user.id;

  console.log("Register Mentor Request:", { user_employee_id, topic_id });

  if (
    !user_employee_id ||
    !topic_id ||
    isNaN(user_employee_id) ||
    isNaN(topic_id)
  ) {
    console.log("Invalid input:", { user_employee_id, topic_id });
    return res
      .status(400)
      .json({ message: "Valid Employee ID and Topic ID are required" });
  }

  try {
    const { rows } = await db.query(
      "INSERT INTO mentors (user_employee_id, topic_id, max_mentees, current_mentees_nu) VALUES ($1, $2, 4, 0) RETURNING mentor_id",
      [user_employee_id, topic_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error registering mentor:", error);
    res.status(500).json({ message: error.message });
  }
};
// Approve mentee request
// Approve mentee request
exports.approveMenteeRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const request = await db.query(
      "SELECT * FROM mentor_requests WHERE request_id = $1",
      [request_id]
    );
    if (request.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { mentor_id, mentee_id } = request.rows[0];

    await db.query("BEGIN");

    const mentor = await db.query(
      "SELECT current_mentees, current_mentees_nu FROM mentors WHERE mentor_id = $1",
      [mentor_id]
    );

    if (mentor.rows.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const currentMentees = mentor.rows[0].current_mentees;
    const currentMenteesNu = mentor.rows[0].current_mentees_nu;

    if (currentMenteesNu >= mentor.rows[0].max_mentees) {
      await db.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Mentor has reached the maximum number of mentees" });
    }

    // Add mentee to current_mentees array
    currentMentees.push(mentee_id);

    await db.query(
      "UPDATE mentors SET current_mentees = $1, current_mentees_nu = current_mentees_nu + 1 WHERE mentor_id = $2",
      [currentMentees, mentor_id]
    );

    const match = await db.query(
      "INSERT INTO matches (mentor_id, mentee_id) VALUES ($1, $2) RETURNING *",
      [mentor_id, mentee_id]
    );

    await db.query(
      "UPDATE mentor_requests SET status = 'approved' WHERE request_id = $1",
      [request_id]
    );

    await db.query("COMMIT");

    res.status(201).json(match.rows[0]);
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error approving mentor request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Approve mentor request
exports.approveMentorRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const request = await db.query(
      "SELECT * FROM mentor_requests WHERE request_id = $1",
      [request_id]
    );
    if (request.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { mentor_id, mentee_id } = request.rows[0];

    await db.query("BEGIN");

    const match = await db.query(
      "INSERT INTO matches (mentor_id, mentee_id) VALUES ($1, $2) RETURNING *",
      [mentor_id, mentee_id]
    );

    await db.query(
      "UPDATE mentors SET current_mentees = current_mentees + 1 WHERE mentor_id = $1",
      [mentor_id]
    );

    await db.query(
      "UPDATE mentor_requests SET status = 'approved' WHERE request_id = $1",
      [request_id]
    );

    await db.query("COMMIT");

    res.status(201).json(match.rows[0]);
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error approving mentor request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get pending requests for a mentor
exports.getPendingRequests = async (req, res) => {
  const { mentor_id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT r.request_id, r.mentee_id, e.name, e.surname, t.topic
       FROM mentor_requests r
       JOIN mentees m ON r.mentee_id = m.mentee_id
       JOIN user_employee e ON m.employee_id = e.emp_id
       JOIN topics t ON m.topic_id = t.topic_id
       WHERE r.mentor_id = $1 AND r.status = 'pending'`,
      [mentor_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching pending requests:", error.message); // Log only the message to avoid circular structure issues
    res.status(500).json({ message: error.message });
  }
};

// Get mentors by topic
exports.getMentorsByTopic = async (req, res) => {
  const { topic_id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT m.mentor_id, e.name, e.surname, t.topic
       FROM mentors m
       JOIN user_employee e ON m.user_employee_id = e.emp_id
       JOIN topics t ON m.topic_id = t.topic_id
       WHERE m.topic_id = $1`,
      [topic_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching mentors by topic:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get mentees by topic
exports.getMenteesByTopic = async (req, res) => {
  const { topic_id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT me.mentee_id, e.name, e.surname, t.topic
       FROM mentees me
       JOIN user_employee e ON me.employee_id = e.emp_id
       JOIN topics t ON me.topic_id = t.topic_id
       WHERE me.topic_id = $1`,
      [topic_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching mentees by topic:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMentorIdByEmployeeId = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const { rows } = await db.query(
      "SELECT mentor_id FROM mentors WHERE user_employee_id = $1",
      [employee_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching mentor ID:", error.message); // Log only the message to avoid circular structure issues
    res.status(500).json({ message: error.message });
  }
};

// Cancel mentor-mentee relationship
exports.cancelMentorMenteeRelationship = async (req, res) => {
  const { mentor_id, mentee_id } = req.body;

  try {
    await db.query("BEGIN");

    const mentor = await db.query(
      "SELECT current_mentees FROM mentors WHERE mentor_id = $1",
      [mentor_id]
    );

    if (mentor.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Mentor not found" });
    }

    const currentMentees = mentor.rows[0].current_mentees;
    const newMentees = currentMentees.filter((id) => id !== mentee_id);

    await db.query(
      "UPDATE mentors SET current_mentees = $1, current_mentees_nu = current_mentees_nu - 1 WHERE mentor_id = $2",
      [newMentees, mentor_id]
    );

    await db.query(
      "DELETE FROM matches WHERE mentor_id = $1 AND mentee_id = $2",
      [mentor_id, mentee_id]
    );

    await db.query(
      "UPDATE mentor_requests SET status = 'cancelled' WHERE mentor_id = $1 AND mentee_id = $2",
      [mentor_id, mentee_id]
    );

    await db.query("COMMIT");

    res
      .status(200)
      .json({ message: "Mentor-mentee relationship cancelled successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error cancelling relationship:", error.message);
    res.status(500).json({ message: error.message });
  }
};
