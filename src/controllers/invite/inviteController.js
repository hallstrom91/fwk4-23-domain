const pool = require("../../utils/connectDB.js");

const createInvite = async (req, res) => {
  const { boardId, invitedEmail } = req.body;
  const invitedBy = req.user.userId;
  try {
    const [findUser] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [invitedEmail],
    );

    if (!findUser || findUser.length === 0) {
      return res.status(404).json({ error: "User email not found" });
    }
    const invitedUserId = findUser[0].id;

    if (invitedUserId === invitedBy) {
      return res
        .status(400)
        .json({ error: "You can not invite yourself madman!" });
    }

    const [existingInvite] = await pool.query(
      `SELECT * FROM invites WHERE board_id = ? AND invited_user_id`,
      [boardId, invitedUserId],
    );

    if (existingInvite > 0) {
      return res
        .status(400)
        .json({ error: "Invite already exists for this user on this board" });
    }

    const [authorizedCheck] = await pool.query(
      `SELECT role FROM board_members WHERE board_id = ? AND user_id = ?`,
      [boardId, invitedBy],
    );

    if (!authorizedCheck || authorizedCheck[0].role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only board admins can send invites" });
    }

    await pool.query(
      `INSERT into invites (board_id, invited_by, invited_user_id, invited_email) VALUES (?, ?, ?, ?)`,
      [boardId, invitedBy, invitedUserId, invitedEmail],
    );
    res.status(201).json({ message: "Invite sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "" });
  }
};

const getInvites = async (req, res) => {
  const userId = req.user.userId;
  const email = req.user.email;
  try {
    const [invites] = await pool.query(
      `SELECT * FROM invites WHERE invited_user_id = ? OR invited_email = ?`,
      [userId, email],
    );
    if (!invites || invites.length === 0) {
      return res.status(404).json({ error: "No invites found" });
    }
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: "" });
  }
};

const acceptInvite = async (req, res) => {
  const inviteId = req.params.inviteId;
  const userId = req.user.userId;
  const role = "member";

  try {
    const [inviteRows] = await pool.query(
      `SELECT * FROM invites WHERE id = ? AND invited_user_id = ?`,
      [inviteId, userId],
    );

    if (!inviteRows || inviteRows.length === 0) {
      return res.status(404).json({ error: "Invite not found" });
    }

    await pool.query(`UPDATE invites SET accepted = TRUE WHERE id = ?`, [
      inviteId,
    ]);
    const boardId = inviteRows[0].board_id;
    await pool.query(
      `INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)`,
      [boardId, userId, role],
    );

    // await pool.query(`DELETE FROM invites WHERE id= ?`, [inviteId])
    res.status(200).json({ message: "Invite accepted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept invite" });
  }
};

module.exports = { createInvite, getInvites, acceptInvite };
