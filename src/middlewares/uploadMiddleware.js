const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { cloudinaryUploadImg } = require("../utils/Cloudinary");
sharp.cache(false);

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "unsupported File Format" }, false);
  }
};

const uploadImages = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});


// resize the image 
const vehicleImageResize = async (req, res, next) => {
  if (!req.files) return next();
  try {
    await Promise.all(
      req.files.map(async (file) => {
        const buffer = await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();
        sharp(buffer).toFile(`upload/${file.filename}`);
        fs.unlinkSync(path.join(__dirname, `../../upload/${file.filename}`));
      })
    );
    next();
  } catch (error) {
    throw new Error(error);
  }
};

// upload image to clouddinary
const uploadVehicleImage = async (req, res,next) => {
  try {
    const file = req.files;
    if (!file) throw new Error("Vehicle Image is not present");
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    req.images = images;
    next();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { vehicleImageResize, uploadImages, uploadVehicleImage };
