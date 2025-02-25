const InstrumentTypeService = require("../../domain/services/instrumentTypeService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const { BadRequestError } = require("../../core/exceptions");

class InstrumentTypeController {
  static addInstrumentType = AsyncHandler(async (req, res) => {
    const user = req.user;
    const instrumentType = await InstrumentTypeService.addInstrumentType(
      { ...req.body, user },
      user
    );
    sendResponse(res, 201, "InstrumentType Added successfully", instrumentType);
  });

  static importInstrumentTypes = AsyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("No file uploaded!");
    }

    // Call the service to process the file
    const result = await InstrumentTypeService.importInstrumentTypeFromFile(
      req.user._id,
      file.path
    );

    res.status(200).json({
      message: "Instrument Types imported successfully",
      data: result,
    });
  });

  static getCountries = AsyncHandler(async (req, res, next) => {
    const { countries, totalDocuments } = await CountryService.getAllCountry(
      req.query
    );

    sendResponse(
      res,
      200,
      "Countries fetched successfully",
      countries,
      totalDocuments
    );
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
      { ...req.body, user },
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
    const instrumentType = await InstrumentTypeService.deleteInstrumentType(
      req.params.id,
      req.user._id
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
