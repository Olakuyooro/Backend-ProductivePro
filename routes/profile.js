const express = require("express");

const router = express.Router();
const profileController = require("../controllers/profile");
const isAuth = require("../middleware/is-auth");

router.get("/profile", isAuth, profileController.getProfile);


module.exports = router