const Vehicle = require("../db/models/vehicleModel");
const dayjs = require("dayjs");
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
const isVehicleBooked = async (req, res, next) => {
  const bookingDate = {
    from: dayjs().format(req.body.from + "T" + req.body.pickUpTime),
    to: dayjs().format(req.body.to + "T" + req.body.returnTime),
  };
  const vehicleId = req.params.id;
  try {
    let countVehicleDate=0;
    const isBooked = await Vehicle.findById(vehicleId);
    isBooked.bookingTimeStamps?.forEach((element) => {
      let isInValid =
        dayjs(bookingDate.from).isSame(element.from) ||
        dayjs(bookingDate.to).isSame(element.to) ||
        dayjs(bookingDate.to).isSame(element.from) ||
        dayjs(bookingDate.from).isSame(element.to) ||
        dayjs(bookingDate.from).isBetween(element.from, element.to) ||
        dayjs(bookingDate.to).isBetween(element.from, element.to);
      if (isInValid) countVehicleDate++;
    });
    if (isBooked.quantity == countVehicleDate) {
      res.json({
        msg: "This vehicle is booked on this date please select another data or vehicle",
      });
      return 
    }else{
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { isVehicleBooked };
