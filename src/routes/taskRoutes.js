const express = require("express");
const { verifyJwt } = require("../utils/jwtUtils.js");
const taskControllers = require("../controllers/task");
const router = express.Router();

router.post("/create/:boardId", verifyJwt, taskControllers.createTask);
router.get("/:boardId/tasks", verifyJwt, taskControllers.getTaskForBoard);
router.get("/:boardId/open/:taskId", verifyJwt, taskControllers.openTask);
router.post("/addcomment/:taskId", verifyJwt, taskControllers.addTaskComment);
router.put("/update/:taskId", verifyJwt, taskControllers.updateTask);
router.put("/update/:commentId", verifyJwt, taskControllers.updateTaskComment);
router.delete("/delete/:taskId", verifyJwt, taskControllers.deleteTask);
router.delete(
  "/delete/:commentId",
  verifyJwt,
  taskControllers.deleteTaskComment,
);

module.exports = router;
