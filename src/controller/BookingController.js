const Bookings = require("../db/models/bookingModel");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Vehicle = require("../db/models/vehicleModel");
const dayjs = require("dayjs");

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find({});
    res.json(bookings);
  } catch (error) {
    throw new Error(error);
  }
};

const getMyBookings = async (req, res) => {
  const { _id } = req.user;
  try {
    validateMongoDbId(_id);
    const userBookings = await Bookings.find({ bookedBy: _id });
    res.json(userBookings);
  } catch (error) {
    throw new Error(error);
  }
};

const cancelBooking = (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id);
  } catch (error) {
    throw new Error(error);
  }
};



module.exports = { getAllBookings, getMyBookings };
