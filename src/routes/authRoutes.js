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
  getAllUsers,
  getBookings,
  forgetPassword,
  resetPassword
} = require("../controller/authController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {isVehicleBooked}= require('../middlewares/vehicleBookingMiddlware')

router.post("/login",loginUser);
router.post("/register", registerUser);
router.post("/booking/:id",authMiddleware,isVehicleBooked,createBooking);
router.post('/forget-password',forgetPassword);

router.put('/logout',authMiddleware,logoutUser);
router.put('/update-user/:id',authMiddleware,updateUser)
router.put('/reset-password/:token',resetPassword)

router.get('/get-users',authMiddleware,isAdmin,getAllUsers);
router.get("/get-bookings", authMiddleware, getBookings);
router.get('/get-user/:id',authMiddleware,isAdmin,getUser);

router.delete('/delete-user/:id',authMiddleware,deleteUser);

module.exports = router;
