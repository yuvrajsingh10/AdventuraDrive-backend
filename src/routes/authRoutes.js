const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  createBooking,
  logoutUser,
  getUser,
  deleteUser,
  updateUser,
} = require("../controller/authController");
const { authMiddleware } = require("../middlerwares/authMiddleware");

router.post("/login",loginUser);
router.post("/register", registerUser);
router.post("/booking",authMiddleware,createBooking);
router.put('/logout',authMiddleware,logoutUser);
router.put('/update-user/:id',authMiddleware,updateUser)
router.get('/get-user/:id',authMiddleware,isAdmin,getUser);
router.get('/get-users',authMiddleware,isAdmin,getAllUsers);
router.delete('/delete-user/:id',authMiddleware,deleteUser);

module.exports = router;
