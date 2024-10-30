const pool = require("../../utils/connectDB.js");

const createBoard = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description is required" });
  }
  try {
    await pool.query(`START TRANSACTION`);

    const [boardResult] = await pool.query(
      "INSERT INTO boards (name, description, created_by) VALUES (?, ?, ?)",
      [name, description, userId],
    );
    const boardId = boardResult.insertId;

    await pool.query(
      "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)",
      [boardId, userId, "admin"],
    );

    await pool.query(`COMMIT`);
    res.status(201).json({ message: "Board created successfully", boardId });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return res.status(500).json({ error: "Failed to create new board" });
  }
};

module.exports = { createBoard };
