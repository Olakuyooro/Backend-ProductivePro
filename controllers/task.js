const Task = require("../models/task");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const date = req.body.date;
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const creator = req.userId;

    console.log("Received data:", { date, title, description, creator });

    const task = new Task({
      title: title,
      description: description,
      date: date,
      creator: creator,
    });

    const result = await task.save();
    console.log("Task saved successfully:", result);

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("Found user:", user);

    user.tasks.push(task);
    const userResult = await user.save();
    console.log("User updated with task:", userResult);

    res.status(201).json({
      message: "Task created successfully!",
      task: task,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    console.error("Error creating task:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ creator: req.userId });
    const todayTasks = tasks.filter(
      (task) => task.date.toDateString() === today.toDateString()
    );
    res.status(200).json({ tasks: todayTasks });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

exports.getUpcomingTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ creator: req.userId });
    const todayTasks = tasks.filter(
      (task) => task.date.toDateString() === today.toDateString()
    );
    const tomorrowTasks = tasks.filter(
      (task) => task.date.toDateString() === tomorrow.toDateString()
    );
    const nextWeekTasks = tasks.filter(
      (task) => task.date > tomorrow && task.date <= nextWeek
    );

    const upcomingTasks = tomorrowTasks.concat(todayTasks, nextWeekTasks);

    res.status(200).json({ tasks: upcomingTasks });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Could not find task");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Task successfully fetched", task: task });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const description = req.body.description;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Could not find task.");
      error.statusCode = 404;
      throw error;
    }
    if (task.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    task.title = title;
    task.description = description;
    const result = await task.save();
    res.status(200).json({ message: "Task updated!", task: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Could not find task.");
      error.statusCode = 404;
      throw error;
    }
    if (task.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    const result = await Task.findByIdAndDelete(taskId);

    const user = await User.findById(req.userId);

    user.tasks.pull(taskId);
    await user.save();
    res.status(200).json({ message: "Deleted task." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
