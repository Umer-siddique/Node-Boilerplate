const express = require("express");
const InstrumentController = require("../controllers/instrumentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// router.get("/details", InstrumentController.getInstrumentsDetail);
// router.post("/create-detail", InstrumentController.addInstrumentDetail);
// router.post("/add-related-treaty", InstrumentController.addRelatedTreaty);
// router.post("/add-groups", InstrumentController.addGroups);

router.get(
  "/:id/ratification-history/:countryId",
  InstrumentController.getRatificationHistoryByCountry
);

router.get(
  "/:instrumentId/country-ratifications",
  InstrumentController.getInstrumentRatifiedByCountries
);

router
  .route("/")
  .get(InstrumentController.getInstruments)
  .post(InstrumentController.addInstrument);

router
  .route("/:id")
  .get(InstrumentController.getInstrument)
  .patch(InstrumentController.updateInstrument)
  .delete(InstrumentController.deleteInstrument);

module.exports = router;
