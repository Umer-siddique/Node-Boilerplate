const express = require("express");
const RegionController = require("../controllers/regionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(RegionController.getRegions)
  .post(RegionController.addRegion);

router
  .route("/:id")
  .get(RegionController.getRegion)
  .patch(RegionController.updateRegion)
  .delete(RegionController.deleteRegion);

module.exports = router;
