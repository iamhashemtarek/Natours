const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ApiFeatures = require("../utils/apiFeatures");

const bodyFilter = function (body, ...allowedFields) {
  let filterdObj = {};

  Object.keys(body).forEach((elem) => {
    if (allowedFields.includes(elem)) {
      filterdObj[elem] = body[elem];
    }
  });

  return filterdObj;
};

exports.getAlluser = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitingFields()
    .pagination();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    results: users.length,
    date: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("no user found by that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("you can not change your password in this route", 403)
    );
  }

  const filterdObj = bodyFilter(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user._id, filterdObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    date: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: "success",
    date: null,
  });
});
