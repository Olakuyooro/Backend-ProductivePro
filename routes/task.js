const express = require("express");
const { body } = require("express-validator");

const taskController = require("../controllers/task");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/tasks", isAuth, taskController.getTasks);

router.get("/upcomingtasks", isAuth, taskController.getUpcomingTasks);

router.post(
  "/task",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  taskController.createTask
);

router.get('/task/:taskId', isAuth, taskController.getTask);

router.put(
  '/task/:taskId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .isLength({ min: 5 })
  ],
  taskController.updateTask
);

router.delete('/task/:taskId', isAuth, taskController.deleteTask);

module.exports = router;
