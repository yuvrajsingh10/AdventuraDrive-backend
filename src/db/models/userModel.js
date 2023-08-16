const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      min: 10,
      // max: 10,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
      enum: ["Admin", "Driver", "User"],
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpiry = Date.now() + 30 * 60 * 1000; // Token will expire in 10 mins
  return resetToken;
};

module.exports = mongoose.model("Users", UserSchema);
