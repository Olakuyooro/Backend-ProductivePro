const express = require("express");
const { body } = require("express-validator");

const stickyWallController = require("../controllers/stickywall");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/stickywall", isAuth, stickyWallController.getStickyWall);

router.post(
  "/create-stickywall",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  stickyWallController.createStickyWall
);

router.delete("/delete-stickywall", isAuth, stickyWallController.deleteSticky);

module.exports = router;
