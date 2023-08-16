const express = require("express");
const router = express.Router();
const { getAllVehicles ,addVehicle} = require("../controller/vehicleController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/all-vehicles", getAllVehicles);

router.post("/vehicle", authMiddleware, isAdmin, addVehicle);   

// router.delete("/delete-vehicle/:id", authMiddleware, isAdmin, removeVehicle);


module.exports = router;