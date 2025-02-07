const express = require("express");
const InstrumentTypeController = require("../controllers/instrumentTypeController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

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
