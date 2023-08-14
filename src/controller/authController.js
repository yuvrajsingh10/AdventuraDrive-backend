// sonodat865@v1zw.com
const generateRefreshToken = require("../config/refreshToken");
const generateToken = require("../config/jwtToken");
const User = require("../db/models/userModel");
const Bookings = require("../db/models/bookingModel");
const validateMongoId = require("../utils/validateMongoDbId");

// login User Controller
const loginUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser && (await findUser.isPasswordMatched(req.body.password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser?._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        expir: 360000 + Date.now(),
        secure: true,
        httpOnly: true,
      });
      res.json({
        name: findUser?.name,
        email: findUser?.email,
        phone: findUser?.phone,
        token: generateToken({ id: findUser?._id }),
      });
    } else {
      res.status(404).send("User is not registered Please login");
    }
  } catch (error) {
    throw new Error(error);
  }
};

//  Register User
const registerUser = async (req, res) => {
  try {
    const isAlreadyRegistered = await User.findOne({ email: req.body.email });
    if (!isAlreadyRegistered) {
      const newUser = await User.create(req.body);
      res.json({
        msg: "User registered Succesfully",
        newUser,
      });
    } else {
      res.status(404).send("user Already Exist Please Login");
    }
  } catch (error) {
    throw new Error(error);
  }
};


// logout-User
const logoutUser = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new Error("This is no refresh Token Attached");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // Forbidden
  }
  await User.findOneAndUpdate(
    refreshToken,
    {
      refreshToken: "",
    },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //Forbidden
};

// create booking 
const createBooking = async (req, res) => {
  try {
    //jobs@mtechhzilla.com
    const { _id } = req.user;
    const {
      vehicleType,
      pickUpLocation,
      dropLocation,
      pickUpTime,
      returnTime,
      pickUpDate,
      returnDate,
    } = req.body;
    validateMongoId(_id);
    const user = await User.findOne(_id);

    const bookings = await Bookings.create({
      vehicleType,
      pickUpLocation,
      dropLocation,
      pickUpTime,
      returnTime,
      pickUpDate,
      returnDate,
      bookedBy: user?._id,
    });
    res.json({
      msg: "Car Booked succesfully",
      booking: bookings,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    throw new Error("Somethig went wrong in fetching user Details");
  }
};

const getUser = async (req, res) => {
  const _id = req.params.id;
  try {
    validateMongoId(_id);
    const user = await User.findById({ _id });
    res.json(user);
  } catch (error) {
    throw new Error("Somethig went wrong Please try again later ");
  }
};

const deleteUser = async (req, res) => {
  const _id = req.params.id;
  try {
    validateMongoId(_id);
    const user = await findByIdAndDelete({ _id });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = (req, res) => {
  const _id = req.params;
  try {
    validateMongoId(_id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  createBooking,
  logoutUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
};
