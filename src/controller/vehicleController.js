const Bookings = require("../db/models/bookingModel");
const Vehicle = require("../db/models/vehicleModel");
const validateMongoDbId = require("../utils/validateMongoDbId");

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    throw new Error(error);
  }
};

const addVehicle = async (req, res) => {
  const vehicleData = req.body;
  try {
    const vehicle = await Vehicle.findOne({name:vehicleData.name});
    if (vehicle) {
      const newVehicle = await Vehicle.findOneAndUpdate(
        {name:vehicle.name},
        {
          $inc: { quantity: +vehicle.quantity },  
        },  
        { new:true }
      );
      res.json(newVehicle);
    } else {
      const newVehicle = await Vehicle.create(vehicleData);
      res.json(newVehicle);
    }
  } catch (error) {
    throw new Error(error);
  }
};

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

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id);
    const updatedVehicle = await Vehicle.findOneAndUpdate({_id:id}, req.body, {
      new: true,
    });
    res.json(updatedVehicle);
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { getAllVehicles, addVehicle,removeVehicle,updateVehicle };
