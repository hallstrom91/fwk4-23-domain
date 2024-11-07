const pool = require("../../utils/connectDB.js");

const getTaskForBoard = async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const [tasks] = await pool.query(`SELECT * FROM tasks WHERE board_id = ?`, [
      boardId,
    ]);

    if (!tasks || tasks.length === 0) {
      return res.status(204).json({
        message: "No tasks found for this board. Create one to get started!",
      });
    }

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

    if (!taskRows || taskRows.length === 0) {
      return res.status(204).json({
        message: "Task not found, cant open what does not exists. Madman!",
      });
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

module.exports = { getTaskForBoard, openTask };
