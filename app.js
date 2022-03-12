// process.on("uncaughtException", (err) => {
//   console.log("uncaught Exception");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const golbalErrorController = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//MW
app.use(express.json());
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

//ROUTES
app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
});

app.use(golbalErrorController);

//DATABASE
const DB_URL = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB_URL).then(() => {
  console.log("database connection successful");
});

// START
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log("unhadled Rejection");
//   console.log(err.name, err.message);
//   app.close(() => {
//     process.exit(1);
//   });
// });
