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
  "/:id/ratification-history",
  InstrumentController.getRatificationHistoryByCountries
);

router.get(
  "/:instrumentId/country-ratifications",
  InstrumentController.getInstrumentRatifiedByCountries
);

router.use(authProtect);

router.post(
  "/import",
  upload.single("file"),
  InstrumentController.importInstruments
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
