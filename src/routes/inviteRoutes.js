const express = require("express");
const router = express.Router();
const { verifyJwt } = require("../utils/jwtUtils.js");

const inviteController = require("../controllers/invite");

router.post("/send", verifyJwt, inviteController.createInvite);
router.get("/get", verifyJwt, inviteController.getInvites);
router.put("/:inviteId/accept", verifyJwt, inviteController.acceptInvite);

module.exports = router;
