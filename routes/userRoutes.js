const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch(
  "/updateMyPassword",
  authController.protected,
  authController.updatePassword
);
router.patch("/updateMe", authController.protected, userController.updateMe);

router.delete("/deleteMe", authController.protected, userController.deleteMe);

router
  .route("/")
  .get(
    authController.protected,
    authController.restrictTo("admin"),
    userController.getAlluser
  );
router
  .route("/:id")
  .get(
    authController.protected,
    authController.restrictTo("admin"),
    userController.getUser
  );

module.exports = router;
