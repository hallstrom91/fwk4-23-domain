const pool = require("../../utils/connectDB.js");

const updateTask = async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;
  const { description, assignedTo, status } = req.body;
  const userId = req.body.userId;

  try {
    const [taskRows] = await pool.query(
      `SELECT * FROM WHERE id = ? AND board_id = ? AND created_by = ?`,
      [taskId, boardId, userId],
    );

    if (!taskRows || taskRows.length === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    await pool.query(
      `UPDATE tasks SET description = ?, assigned_to = ?, status = ?, WHERE id = ?`,
      [description, assignedTo, status, taskId],
    );
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "" });
  }
};

const deleteTask = async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;
  const userId = req.user.userId;

  try {
    const [taskRows] = await pool.query(
      `SELECT * FROM tasks WHERE id = ? AND board_id = ? AND created_by = ?`,
      [taskId, boardId, userId],
    );

    if (!taskRows || taskRows.length === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    await pool.query(`DELETE FROM tasks WHERE id = ?`, [taskId]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

const updateTaskComment = async (req, res) => {
  const commentId = req.params.commentId;
  const { comment } = req.body;
  const userId = req.user.userId;

  if (!comment) {
    return res.status(400).json({ error: "Comment is required" });
  }
  try {
    const [commentRows] = await pool.query(
      `SELECT * FROM task_comments WHERE id = ? AND user_id = ?`,
      [commentId, userId],
    );

    if (!commentRows || commentRows.length === 0) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }
    await pool.query(`UPDATE task_comments SET comment = ? WHERE id = ?`, [
      comment,
      commentId,
    ]);
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteTaskComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;

  try {
    const [commentRows] = await pool.query(
      `SELECT * FROM task_comments WHERE id = ? AND user_id = ?`,
      [commentId, userId],
    );

    if (!commentRows || commentRows.length === 0) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }
    await pool.query(`DELETE FROM task_comments WHERE id = ?`, [commentId]);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  updateTask,
  deleteTask,
  updateTaskComment,
  deleteTaskComment,
};
