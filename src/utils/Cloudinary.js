const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

const cloudinaryUploadImg = async (fileToUpload) => {
    // console.log(fileToUpload)
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpload, (error,result) => {
      // console.log('this is resulte',result)
      resolve(
        {
          url: result?.secure_url,
          asset_id: result?.asset_id,
          public_id: result?.public_id,
        },
        {
          resourse_type: "auto",
        }
      );
    });
  });
};

const cloudinaryImageDelete = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};
module.exports = { cloudinaryUploadImg, cloudinaryImageDelete };
