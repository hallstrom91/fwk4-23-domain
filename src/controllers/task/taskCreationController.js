const pool = require("../../utils/connectDB.js");

const createTask = async (req, res) => {
  const boardId = req.params.boardId;
  const { title, description, assignedTo } = req.body;
  const createdBy = req.user.userId;
  const status = "undone";

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

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

const addTaskComment = async (req, res) => {
  const taskId = req.params.taskId;
  const { comment } = req.body;
  const userId = req.user.userId;

  if (!comment) {
    return res.status(400).json({ error: "Comment value is required" });
  }

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

module.exports = { createTask, addTaskComment };
