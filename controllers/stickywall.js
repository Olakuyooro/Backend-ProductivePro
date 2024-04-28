const StickyWall = require("../models/stickywall");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.createStickyWall = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const creator = req.userId;

    const stickyWall = new StickyWall({
      title: title,
      description: description,
      type: type,
      creator: creator,
    });

    const result = await stickyWall.save();

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not Found!");
    }

    user.stickyWalls.push(stickyWall);
    const userResult = await user.save();

    console.log("User updated with task:", userResult);

    res.status(201).json({
      message: "StickyWall created successfully!",
      stickyWall: stickyWall,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (error) {
    console.error("Error creating stickyWall:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};

exports.getStickyWall = async (req, res, next) => {
  try {
    const stickyWall = await StickyWall.find({ creator: req.userId });
    res.status(200).json({ stickyWall: stickyWall });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

exports.deleteSticky = async (req, res, next) => {
  const stickyId = req.params.stickyId;
  try {
    const sticky = await StickyWall.findById(stickyId);
    if (!sticky) {
      const error = new Error("Could not find sticky wall.");
      error.statusCode = 404;
      throw error;
    }
    if (sticky.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    const result = await StickyWall.findByIdAndDelete(stickyId);

    const user = await User.findById(req.userId);

    user.stickyWalls.pull(stickyId);
    await user.save();
    res.status(200).json({ message: "Deleted sticky." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
