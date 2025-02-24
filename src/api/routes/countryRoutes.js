const express = require("express");
const CountryController = require("../controllers/countryController");
const authProtect = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authProtect);

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
