const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "a user must have an email"],
    trim: true,
    validate: [validator.isEmail, "incorrect email"],
  },
  role: {
    type: String,
    enum: ["admin", "user","moderator"],
    default: "user",
  },
  password: {
    type: String,
    minlength: [8, "a password must be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "not identical",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

userSchema.pre("save", function (next) {
  const salt = bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctpass = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
