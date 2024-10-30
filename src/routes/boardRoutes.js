const express = require("express");
const { verifyJwt } = require("../utils/jwtUtils.js");
const boardController = require("../controllers/board");

const router = express.Router();

router.post("/create", verifyJwt, boardController.createBoard);
router.get("/my-boards", verifyJwt, boardController.getAllUserBoards);
router.post("/adduser/:boardId", verifyJwt, boardController.addBoardMember);

// new routes
router.get("/:boardId", verifyJwt, boardController.getBoardWithTasks);
router.put("/update/:boardId", verifyJwt, boardController.updateBoard);
router.put(
  "/:boardId/updateuser/:userIdToUpdate",
  verifyJwt,
  boardController.updateBoardMemberRole,
);
router.delete(
  "/:boardId/removeuser/:userIdToRemove",
  verifyJwt,
  boardController.removeBoardMember,
);
router.delete("/deleteboard/:boardId", verifyJwt, boardController.deleteBoard);

module.exports = router;
