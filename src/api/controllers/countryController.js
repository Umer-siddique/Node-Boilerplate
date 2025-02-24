const CountryService = require("../../domain/services/countryService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class CountryController {
  static addCountry = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const country = await CountryService.addCountry({
      ...req.body,
      user,
    });
    sendResponse(res, 201, "Country Added successfully", country);
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

  static getAllCountries = AsyncHandler(async (req, res, next) => {
    const countries = await CountryService.getAllCountries();
    sendResponse(res, 200, "Countries fetched successfully", countries);
  });

  static getCountry = AsyncHandler(async (req, res, next) => {
    const country = await CountryService.getCountryById(req.params.id);
    sendResponse(res, 200, "Country fetched successfully", country);
  });

  static updateCountry = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const country = await CountryService.updateCountry(req.params.id, {
      ...req.body,
      user,
    });
    sendResponse(res, 200, "Country updated sucessfully", country);
  });

  static deleteCountry = AsyncHandler(async (req, res, next) => {
    const country = await CountryService.deleteCountry(req.params.id);
    sendResponse(res, 204, "Country deleted sucessfully", country);
  });
}

module.exports = CountryController;
