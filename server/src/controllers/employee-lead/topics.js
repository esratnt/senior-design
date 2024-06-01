const db = require("../../db");

// Get all topics
exports.getTopics = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM topics");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: error.message });
  }
};
