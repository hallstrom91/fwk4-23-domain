const pool = require("../../utils/connectDB.js");

const updateBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const { name, description } = req.body;
  const userId = req.user.userId;

  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Board name and description is required" });
  }

  try {
    const [boardRows] = await pool.query(
      `SELECT * FROM boards WHERE id = ? AND created_by = ?`,
      [boardId, userId],
    );

    if (!boardRows || boardRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Board not found or unauthorized" });
    }

    await pool.query(
      `UPDATE boards SET name = ?, description = ? WHERE id = ?`,
      [name, description, boardId],
    );

    res.status(200).json({ message: "Board updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update board" });
  }
};

const deleteBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const userId = req.user.userId;

  try {
    const [boardRows] = await pool.query(
      `SELECT * FROM boards WHERE id = ? created_by = ?`,
      [boardId, userId],
    );

    if (!boardRows || boardRows.length === 0) {
      return res.status(404).json({ error: "Board not found or unauthorized" });
    }

    await pool.query(`DELETE FROM boards WHERE id = ?`, [boardId]);
    await pool.query(`DELETE FROM board_members WHERE board_id = ?`, [boardId]);

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete board" });
  }
};

const addBoardMember = async (req, res) => {
  const boardId = req.params.boardId;
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ error: "User ID and role are required" });
  }

  try {
    const [existingMember] = await pool.query(
      `SELECT * FROM board_members WHERE board_id = ? AND user_id`,
      [boardId, userId],
    );

    if (existingMember.length > 0) {
      return res
        .status(409)
        .message({ error: "User is already member of this board" });
    }

    await pool.query(
      "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)",
      [boardId, userId, role],
    );

    res.status(201).json({ message: "Member added to board" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member to board" });
  }
};
const updateBoardMember = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error });
  }
};

const removeBoardMember = async (req, res) => {
  const boardId = req.params.boardId;
  const removeUserId = req.params.userIdToRemove;
  const userId = req.user.userId;

  if (!removeUserId) {
    return res
      .status(400)
      .json({ error: "User ID for removal of access is required" });
  }

  try {
    const [boardRows] = await pool.query(`SELECT * FROM boards WHERE id = ?`, [
      boardId,
    ]);

    if (!boardRows || boardRows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }

    const [authorizedCheck] = await pool.query(
      `SELECT * FROM board_members WHERE board_id = ? AND user_id = ? AND role = 'admin'`,
      [boardId, userId],
    );

    if (authorizedCheck === 0) {
      return res
        .status(403)
        .json({ error: "Only board admins can remove users" });
    }
    await pool.query(
      `DELETE FROM board_members WHERE board_id = ? AND user_id = ?`,
      [boardId, removeUserId],
    );
    res.status(200).json({ message: "Member removed from board" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member from board" });
  }
};

const updateBoardMemberRole = async (req, res) => {
  const boardId = req.params.boardId;
  const userId = req.user.userId;
  const { role } = req.body;
  const updateUserId = req.params.userIdToUpdate;

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  try {
    const [boardRows] = await pool.query(`SELECT * FROM boards WHERE id = ?`, [
      boardId,
    ]);

    if (!boardRows || boardRows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }

    const [authorizedCheck] = await pool.query(
      `SELECT * FROM board_members WHERE board_id = ? AND user_id = ? AND role = 'admin'`,
      [boardId, userId],
    );

    if (authorizedCheck === 0) {
      return res
        .status(403)
        .json({ error: "Only board admins can update member roles" });
    }

    await pool.query(
      `UPDATE board_members SET role = ? WHERE board_id = ? AND user_id = ?`,
      [role, boardId, updateUserId],
    );
    res.status(200).json({ message: "Member role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update member role" });
  }
};

module.exports = {
  updateBoard,
  deleteBoard,
  addBoardMember,
  removeBoardMember,
  updateBoardMemberRole,
};
