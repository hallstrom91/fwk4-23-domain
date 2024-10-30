const pool = require("../../utils/connectDB.js");

const getAllUserBoards = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [boards] = await pool.query(
      `SELECT b.id, b.name, b.description, b.created_at, b.created_by, bm.role 
                 FROM board_members bm 
                 JOIN boards b ON bm.board_id = b.id 
                 WHERE bm.user_id = ?`,
      [userId],
    );

    if (!boards || boards.length === 0) {
      return res.status(404).json({ message: "No boards found" });
    }

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Failed to get boards related to user" });
  }
};

const getBoardWithTasks = async (req, res) => {
  const boardId = req.params.boardId;
  const userId = req.user.userId;

  try {
    const [memberCheck] = await pool.query(
      `SELECT role FROM board_members WHERE board_id = ? AND user_id = ?`,
      [boardId, userId],
    );

    if (!memberCheck || memberCheck.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const [boardRows] = await pool.query(`SELECT * FROM boards WHERE id = ?`, [
      boardId,
    ]);

    if (!boardRows || boardRows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }

    const [tasks] = await pool.query(`SELECT * FROM tasks WHERE board_id = ?`, [
      boardId,
    ]);
    res.status(200).json({
      board: boardRows[0],
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get board and tasks" });
  }
};
module.exports = { getAllUserBoards, getBoardWithTasks };
