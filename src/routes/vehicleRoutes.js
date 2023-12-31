const express = require("express");
const router = express.Router();
const {
  getAllVehicles,
  addVehicle,
  removeVehicle,
  updateVehicle,
  // uploadVehicleImages,
  checkAvailability
} = require("../controller/vehicleController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  vehicleImageResize,
  uploadImages,
  uploadVehicleImage
} = require("../middlewares/uploadMiddleware");

router.get("/all-vehicles", getAllVehicles);

router.post("/check-vehicle-available", checkAvailability);
router.post("/vehicle", authMiddleware, isAdmin,uploadImages.array("images", 10),vehicleImageResize,uploadVehicleImage, addVehicle);
// router.post(
//   "/upload",
//   authMiddleware,
//   isAdmin,
//   uploadImages.array("images", 10),
//   vehicleImageResize,
//   uploadVehicleImages
// );
router.put("/update-vehicle/:id", authMiddleware, isAdmin, updateVehicle);
router.delete("/delete-vehicle/:id", authMiddleware, isAdmin, removeVehicle);

module.exports = router;
