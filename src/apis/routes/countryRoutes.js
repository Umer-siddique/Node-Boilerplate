const express = require("express");
const CountryController = require("../controllers/countryController");
const authProtect = require("../middlewares/authMiddleware");
const upload = require("../../config/multer"); // Import the multer config

const router = express.Router();

router.get("/metrics", CountryController.getCountriesAndRankings);

router.use(authProtect);

router.post(
  "/import",
  upload.single("file"),
  CountryController.importCountries
);

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
