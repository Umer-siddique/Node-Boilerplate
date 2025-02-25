const express = require("express");
const RegionController = require("../controllers/regionController");
const authProtect = require("../middlewares/authMiddleware");
const upload = require("../../config/multer"); // Import the multer config

const router = express.Router();

router.post("/import", upload.single("file"), RegionController.importRegions);

router.use(authProtect);

router.get("/parents", RegionController.getParentRegions);
router.get("/childs", RegionController.getChildRegions);

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
