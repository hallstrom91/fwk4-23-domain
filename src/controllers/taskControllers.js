const pool = require("../utils/connectDB.js");

const createTask = async (req, res) => {
  const boardId = req.params.boardId;
  const { title, description, assignedTo } = req.body;
  const createdBy = req.user.userId;
  const status = "undone";
  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (board_id, title, description, assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?, ?)",
      [boardId, title, description, assignedTo, createdBy, status],
    );
    res.status(201).json({ message: "Task created", taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new task" });
  }
};

/* const getTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      taskId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to get selected task" });
  }
}; */

const getTaskForBoard = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const [tasks] = await pool.query(`SELECT * FROM tasks WHERE board_id`);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to get tasks" });
  }
};

const openTask = async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;
  try {
    const [taskRows] = await pool.query(
      `SELECT * FROM tasks WHERE id = ? AND board_id = ?`,
      [taskId, boardId],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    const [comments] = await pool.query(
      `SELECT * from task_comments WHERE task_id = ?`,
      [taskId],
    );
    res.status(200).json({
      task: taskRows[0],
      comments: comments,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to open selected task" });
  }
};

const addTaskComment = async (req, res) => {
  const taskId = req.params.taskId;
  const { comment } = req.body;
  const userId = req.user.userId;

  try {
    await pool.query(
      "INSERT INTO task_comments (task_id, comment, user_id) VALUES (?, ?, ?)",
      [taskId, comment, userId],
    );
    res.status(201).json({ message: "Comment added to task" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment to selected task" });
  }
};

module.exports = { createTask, getTaskForBoard, openTask, addTaskComment };
