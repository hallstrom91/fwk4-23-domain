const express = require("express");
const {
  createTask,
  getTaskForBoard,
  openTask,
  addTaskComment,
} = require("../controllers/taskControllers.js");
const { verifyJwt } = require("../utils/jwtUtils.js");

const router = express.Router();

router.post("/create/:boardId", verifyJwt, createTask);

router.get("/:boardId/tasks", verifyJwt, getTaskForBoard);

router.get("/:boardId/open/:taskId", verifyJwt, openTask);

router.post("/addcomment/:taskId", verifyJwt, addTaskComment);

module.exports = router;
