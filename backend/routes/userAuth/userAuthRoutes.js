const express = require("express");
const {
  register,
  login,
  getUserDetails,
} = require("../../controllers/auth/userAuthController");

const authMiddleware = require("../../Middleware/authMiddleware");

const router = express.Router();

// user Registration and Login

router.post("/register", register);
router.post("/login", login);

// get user details
router.get("/details", authMiddleware, getUserDetails);

module.exports = router;
