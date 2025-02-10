const RegionService = require("../../domain/services/regionService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class RegionController {
  static addRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.addRegion(req.body);
    sendResponse(res, 201, "Region Added successfully", region);
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

  static getRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.getRegionById(req.params.id);
    sendResponse(res, 200, "Region fetched successfully", region);
  });

  static updateRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.updateRegion(req.params.id, req.body);
    sendResponse(res, 200, "Region updated sucessfully", region);
  });

  static deleteRegion = AsyncHandler(async (req, res, next) => {
    const region = await RegionService.deleteRegion(req.params.id);
    sendResponse(res, 204, "Region deleted sucessfully", region);
  });
}

module.exports = RegionController;
