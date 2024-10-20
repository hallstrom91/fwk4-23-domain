const pool = require("../utils/connectDB.js");

const createBoard = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;
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
    res.status(500).json({ error: "Failed to create new board" });
  }
};

const getUserBoards = async (req, res) => {
  const userId = req.user.userId;
  try {
    const [boards] = await pool.query(
      `SELECT b.id, b.name, b.description, b.created_at, b.created_by, bm.role 
                 FROM board_members bm 
                 JOIN boards b ON bm.board_id = b.id 
                 WHERE bm.user_id = ?`,
      [userId],
    );

    if (boards.length === 0) {
      return res.status(404).json({ message: "No boards found" });
    }

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Failed to get boards related to user" });
  }
};

const addBoardMember = async (req, res) => {
  const boardId = req.params.boardId;
  const { userId, role } = req.body;
  try {
    await pool.query(
      "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)",
      [boardId, userId, role],
    );

    res.status(201).json({ message: "Member added to board" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member to board" });
  }
};

module.exports = { createBoard, getUserBoards, addBoardMember };
