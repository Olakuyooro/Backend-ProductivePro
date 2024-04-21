const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        try {
          const userDoc = await User.findOne({ email: value });
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        } catch (error) {
          throw new Error("Database error");
        }
      })
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),

    body("name").trim().not().isEmpty().withMessage("Name cannot be empty."),
  ],
  authController.signup
);


router.post("/login", authController.login);

module.exports = router;
