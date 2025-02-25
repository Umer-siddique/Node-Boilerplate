const express = require("express");
const InstrumentTypeController = require("../controllers/instrumentTypeController");
const authProtect = require("../middlewares/authMiddleware");
const upload = require("../../config/multer"); // Import the multer config

const router = express.Router();

router.post(
  "/import",
  upload.single("file"),
  InstrumentTypeController.importInstrumentTypes
);

router.use(authProtect);

router
  .route("/")
  .get(InstrumentTypeController.getInstrumentTypes)
  .post(InstrumentTypeController.addInstrumentType);

router
  .route("/:id")
  .get(InstrumentTypeController.getInstrumentType)
  .patch(InstrumentTypeController.updateInstrumentType)
  .delete(InstrumentTypeController.deleteInstrumentType);

module.exports = router;
