const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../db/models/userModel");

const authMiddleware = async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById({ _id: decoded.id.id });
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired ,Please Login Again");
    }
  } else {
    throw new Error("There is noe token attached to tha header");
  }
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  try {
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "Admin") throw new Error("You are not an admin");
    else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { authMiddleware, isAdmin };
