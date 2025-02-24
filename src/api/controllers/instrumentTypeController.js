const InstrumentTypeService = require("../../domain/services/instrumentTypeService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class InstrumentTypeController {
  static addInstrumentType = AsyncHandler(async (req, res) => {
    const user = req.user;
    const instrumentType = await InstrumentTypeService.addInstrumentType(
      req.body,
      user
    );
    sendResponse(res, 201, "InstrumentType Added successfully", instrumentType);
  });

  static getInstrumentTypes = AsyncHandler(async (req, res, next) => {
    const { instrumentTypes, totalDocuments } =
      await InstrumentTypeService.getAllInstrumentType(req.query);
    sendResponse(
      res,
      200,
      "InstrumentTypes fetched successfully",
      instrumentTypes,
      totalDocuments
    );
  });

  static getInstrumentType = AsyncHandler(async (req, res, next) => {
    const instrumentType = await InstrumentTypeService.getInstrumentTypeById(
      req.params.id
    );
    sendResponse(
      res,
      200,
      "InstrumentType fetched successfully",
      instrumentType
    );
  });

  static updateInstrumentType = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const instrumentType = await InstrumentTypeService.updateInstrumentType(
      req.params.id,
      req.body,
      user
    );
    sendResponse(
      res,
      200,
      "InstrumentType updated successfully",
      instrumentType
    );
  });

  static deleteInstrumentType = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const instrumentType = await InstrumentTypeService.deleteInstrumentType(
      req.params.id,
      user
    );
    sendResponse(
      res,
      204,
      "InstrumentType deleted sucessfully",
      instrumentType
    );
  });
}

module.exports = InstrumentTypeController;
