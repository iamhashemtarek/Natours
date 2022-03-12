const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/top-cheapest-5")
  .get(tourController.topCheapest5, tourController.getAllTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protected,
    authController.restrictTo("admin", "moderator"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protected,
    authController.restrictTo("admin", "moderator"),
    tourController.updateTour
  )
  .delete(
    authController.protected,
    authController.restrictTo("admin", "moderator"),
    tourController.deleteTour
  );

module.exports = router;
