const express = require("express");
const router = express.Router();
const {getAllBookings} = require("../controller/BookingController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/all-bookings", authMiddleware, isAdmin, getAllBookings);


module.exports = router;
