const InstrumentTypeService = require("../../domain/services/instrumentTypeService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class InstrumentTypeController {
  static addInstrumentType = AsyncHandler(async (req, res, next) => {
    const instrumentType = await InstrumentTypeService.addInstrumentType(
      req.body
    );
    sendResponse(res, 201, "InstrumentType Added successfully", instrumentType);
  });

  static getInstrumentTypes = AsyncHandler(async (req, res, next) => {
    const instrumentTypes = await InstrumentTypeService.getAllInstrumentType();
    sendResponse(
      res,
      200,
      "InstrumentTypes fetched successfully",
      instrumentTypes
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
    const instrumentType = await InstrumentTypeService.updateInstrumentType(
      req.params.id,
      req.body
    );
    sendResponse(
      res,
      200,
      "InstrumentType updated sucessfully",
      instrumentType
    );
  });

  static deleteInstrumentType = AsyncHandler(async (req, res, next) => {
    const instrumentType = await InstrumentTypeService.deleteInstrumentType(
      req.params.id
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
