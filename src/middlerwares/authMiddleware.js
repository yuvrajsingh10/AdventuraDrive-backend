const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../db/models/userModel");

const authMiddleware = async (req, res, next) => {
  let token;
  console.log(req.headers)
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
    console.log('this is the token here    :   ',token)
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("sfsdfsdfsd  :   ", decoded.id.id);
        const user = await User.findById({_id:decoded.id.id});
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


module.exports ={authMiddleware}