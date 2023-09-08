// sonodat865@v1zw.com
const generateRefreshToken = require("../config/refreshToken");
const generateToken = require("../config/jwtToken");
const User = require("../db/models/userModel");
const Bookings = require("../db/models/bookingModel");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Vehicle = require("../db/models/vehicleModel");
const { sendMail } = require("./emailController");
const crypto = require("crypto");
const dayjs = require("dayjs");
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

// login User Controller
const loginUser = async (req, res) => {

  try {
    const findUser = await User.findOne({ email: req.body.email.toLowerCase() });

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
      res.status(409).send("User is not registered ");
    }
  } catch (error) {
    throw new Error(error);
  }
};

//  Register User
const registerUser = async (req, res) => {
  try {

    const isAlreadyRegistered = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!isAlreadyRegistered) {
      const newUser = await User.create({
        name:req.body.name,
        email:req.body.email.toLowerCase(),
        age:req.body.age,
        phone:req.body.phone,
        password:req.body.password
      });
      res.json({
        msg: "User registered Succesfully",
      });
    } else {
      res.status(409).send({msg:"user Already Exist Please Login"});
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
    {refreshToken},
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
    const vehicleId = req.params.id;
    const { _id } = req.user;
    const {
      vehicleType,
      pickUpLocation,
      dropLocation,
      pickUpTime,
      returnTime,
      from,
      to,
    } = req.body;
    const bookingDate = {
      from: dayjs().format(from + "T" + pickUpTime),
      to: dayjs().format(to + "T" + returnTime),
    };
    validateMongoDbId(_id);
    const user = await User.findOne(_id);

    const bookings = await Bookings.create({
      vehicleType,
      pickUpLocation,
      dropLocation,
      pickUpTime,
      returnTime,
      bookingFrom: from + pickUpTime,
      bookingTo: to + returnTime,
      bookingTimeStamps: { $push: from, to },
      bookingStatus: "processing",
      bookedBy: user?._id,
    });

    const vehicle = await Vehicle.findById(vehicleId);
    vehicle.bookingTimeStamps.push({
      from: dayjs().format(bookingDate.from),
      to: dayjs().format(bookingDate.to),
    });// refmvancouver
    await vehicle.save();
    res.json({
      msg: "Car Booked succesfully",
      booking: bookings,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUsers = async (req, res) => {
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
    validateMongoDbId(_id);
    const user = await User.findById({ _id });
    res.json(user); 
  } catch (error) {
    throw new Error("Somethig went wrong Please try again later ");
  }
};

const deleteUser = async (req, res) => {
  const _id = req.params.id;
  try {
    validateMongoDbId(_id);
    const user = await User.findByIdAndDelete({ _id });
    const bookings = await Bookings.deleteMany({ bookedBy: _id });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = (req, res) => {
  const _id = req.params;
  try {
    validateMongoDbId(_id);
  } catch (error) {
    throw new Error(error);
  }
};

const getBookings = async (req, res) => {
  const { _id } = req.user;
  try {
    validateMongoDbId(_id);
    const userBookings = await Bookings.find({ bookedBy: _id });
    res.json(userBookings);
  } catch (error) {
    throw new Error(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email is not regesited ! please regester ");

    const token = await user.createPasswordResetToken();
    await user.save();
    // const text = "Hey please follow this link to reset password .";
    const resetUrl = `Hey please follow this link to reset password .
    This link is valid for  10 min from now <br/> <a href="http//localhost:3000/api/user/reset-password/${token}">{Click here}</a>`;

    const data = {
      email: user.email,
      name: user.name,
      text: "Hey User",
      subject: "Forget Password Link",
      resetUrl: resetUrl,
    };
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken,
      passwordResetTokenExpiry: { $gte: Date.now() },
    });
    if (!user)
      throw new Error("Reset password link is Expire ! Please reset it again");
    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetTokenExpiry = "";
    await user.save();
    res.json({
      msg: "Password Updated",
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  createBooking,
  logoutUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getBookings,
  forgetPassword,
  resetPassword,
};
