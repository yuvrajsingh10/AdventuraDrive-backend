const Vehicle = require("../db/models/vehicleModel");
const validateMongoDbId = require("../utils/validateMongoDbId");
const dayjs = require("dayjs");


// get All vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    throw new Error(error);
  }
};

// add vehicle 

const addVehicle = async (req, res) => {
  const vehicleData = req.body;
  try {
    const vehicle = await Vehicle.findOne({ name: vehicleData.name });
    if (vehicle) {
      const newVehicle = await Vehicle.findOneAndUpdate(
        { name: vehicle.name },
        {
          $inc: { quantity: +vehicle.quantity },
        },
        { new: true }
      );
      res.json(newVehicle);
    } else {
      const newVehicle = await Vehicle.create({...vehicleData,images:[...req.images]}); 
      res.json(newVehicle);
    }
  } catch (error) {
    throw new Error(error);
  }
};

// remove Vechicle
const removeVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id);
    const deleteVehicle = await Vehicle.findOneAndDelete(id);
    res.json(deleteVehicle);
  } catch (error) {
    throw new Error(error);
  }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id);
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedVehicle);
  } catch (error) {
    throw new Error(error);
  }
};


// Check the vechicle Availability 
const checkAvailability = async (req, res) => {
  const {
    vehicleType,
    pickUpTime,
    returnTime,
    from,
    to,
  } = req.body;
  try {
    const bookingDate = {
      from: dayjs().format(from + "T" + pickUpTime),
      to: dayjs().format(to + "T" + returnTime),
    };
    const availablbilityVehicle = await Vehicle.find({});


    let vehicles = availablbilityVehicle.filter((vehicleAvail) => {
      let date = [];
      date = vehicleAvail.bookingTimeStamps.filter(
        (element) =>
          dayjs(bookingDate.from).isSame(element.from) ||
          dayjs(bookingDate.to).isSame(element.to) ||
          dayjs(bookingDate.to).isSame(element.from) ||
          dayjs(bookingDate.from).isSame(element.to) ||
          dayjs(bookingDate.from).isBetween(element.from, element.to) ||
          dayjs(bookingDate.to).isBetween(element.from, element.to)
      );
      if ((vehicleAvail.bookingTimeStamps.length === 0 || date.length===0)&& vehicleType == vehicleAvail.category)
        return vehicleAvail;
    });
    res.json(vehicles);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getAllVehicles,
  addVehicle,
  removeVehicle,
  updateVehicle,
  checkAvailability,

};
