const express = require("express");
const CountryController = require("../controllers/countryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(CountryController.getCountries)
  .post(CountryController.addCountry);

router
  .route("/:id")
  .get(CountryController.getCountry)
  .patch(CountryController.updateCountry)
  .delete(CountryController.deleteCountry);

module.exports = router;
