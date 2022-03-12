const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV == "production") {
   // let error = { ...err };
    let error = Object.defineProperties({}, Object.getOwnPropertyDescriptors(err));

    if (err.name === "CastError") {
      const message = `invalid ${error.path}: ${error.value}`;
      error = new AppError(message, 400);
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      const message = `Invalid input data. ${errors.join(". ")}`;
      error = new AppError(message, 400);
    }

    if (err.code === 11000) {
      const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
      const message = `Duplicate field value: ${value}. Please use another value!`;
      error = new AppError(message, 400);
    }

    if (1) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message ,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "somthing went wrong",
      });
    }
  }
};
