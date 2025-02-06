const express = require("express");
const RegionController = require("../controllers/regionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(RegionController.getCountries)
  .post(RegionController.addCountry);

router
  .route("/:id")
  .get(RegionController.getCountry)
  .patch(RegionController.updateCountry)
  .delete(RegionController.deleteCountry);

module.exports = router;
