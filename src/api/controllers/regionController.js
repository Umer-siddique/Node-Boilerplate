const RegionService = require("../../domain/services/regionService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class RegionController {
  static addRegion = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const region = await RegionService.addRegion({ ...req.body, user });
    sendResponse(res, 201, "Region Added successfully", region);
  });

  static importRegions = AsyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Call the service to process the file
    const result = await RegionService.importRegionsFromFile(file.path);

    res.status(200).json({
      message: "Regions imported successfully",
      data: result,
    });
  });

  static getRegions = AsyncHandler(async (req, res, next) => {
    const { regions, totalDocuments } = await RegionService.getAllRegion(
      req.query
    );
    sendResponse(
      res,
      200,
      "Regions fetched successfully",
      regions,
      totalDocuments
    );
  });

  static getParentRegions = AsyncHandler(async (req, res, next) => {
    const regions = await RegionService.getParentRegions();
    sendResponse(res, 200, "Regions fetched successfully", regions);
  });

  static getChildRegions = AsyncHandler(async (req, res, next) => {
    const subRegions = await RegionService.getChildRegions();
    sendResponse(res, 200, "Sub Regions fetched successfully", subRegions);
  });

  static getRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.getRegionById(req.params.id);
    sendResponse(res, 200, "Region fetched successfully", region);
  });

  static updateRegion = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const region = await RegionService.updateRegion(req.params.id, {
      ...req.body,
      user,
    });
    sendResponse(res, 200, "Region updated sucessfully", region);
  });

  static deleteRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.deleteRegion(req.params.id);
    sendResponse(res, 204, "Region deleted sucessfully", region);
  });
}

module.exports = RegionController;
