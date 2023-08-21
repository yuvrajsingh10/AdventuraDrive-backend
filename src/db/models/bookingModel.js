const mongoose = require("mongoose");

const bookingTimeStams = mongoose.Schema({});

const bookingSchema = mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    // pickUpDate: {
    //   type: Date,
    //   required: true,
    // },
    bookingFrom: {
      type: String,
      required: true,
    },
    bookingTo: {
      type: String,
      required: true,
    },
    pickUpTime: {
      type: String,
      required: true,
    },
    returnTime: {
      type: String,
      required: true,
    },
    bookingStatus: {
      type: String,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingSchema);
