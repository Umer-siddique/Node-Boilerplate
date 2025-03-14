const express = require("express");
const InstrumentController = require("../controllers/instrumentController");
const authProtect = require("../middlewares/authMiddleware");
const upload = require("../../config/multer"); // Import the multer config

const router = express.Router();

// router.get("/details", InstrumentController.getInstrumentsDetail);
// router.post("/create-detail", InstrumentController.addInstrumentDetail);
// router.post("/add-related-treaty", InstrumentController.addRelatedTreaty);
// router.post("/add-groups", InstrumentController.addGroups);
// Route for importing instruments via CSV/Excel

router.get(
  "/ratifications-count-by-year",
  InstrumentController.getRatificaitonCountsByYears
);

router.get(
  "/country-profile-data/:countryId",
  InstrumentController.getCountryProfileData
);

router.get(
  "/:id/ratification-history",
  InstrumentController.getRatificationHistoryByCountries
);

router.get(
  "/:instrumentId/country-ratifications",
  InstrumentController.getInstrumentRatifiedByCountries
);

router.get(
  "/total-ratifications",
  InstrumentController.getInstrumentsTotalRatificaitons
);

router.post(
  "/import",
  upload.single("file"),
  authProtect,
  InstrumentController.importInstruments
);

router
  .route("/")
  .get(InstrumentController.getInstruments)
  .post(authProtect, InstrumentController.addInstrument);

router
  .route("/:id")
  .get(InstrumentController.getInstrument)
  .patch(authProtect, InstrumentController.updateInstrument)
  .delete(authProtect, InstrumentController.deleteInstrument);

module.exports = router;
