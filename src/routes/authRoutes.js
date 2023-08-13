const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  createBooking,
  logoutUser,
} = require("../controller/authController");
const { authMiddleware } = require("../middlerwares/authMiddleware");

router.post("/login",loginUser);
router.post("/register", registerUser);
router.post("/booking",authMiddleware,createBooking);
router.put('/logout',authMiddleware,logoutUser)

module.exports = router;
