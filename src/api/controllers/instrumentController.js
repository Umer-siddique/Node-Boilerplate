const InstrumentService = require("../../domain/services/instrumentService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const Country = require("../../domain/entities/Country");
const Instrument = require("../../domain/entities/Instrument");
const { default: mongoose } = require("mongoose");

class InstrumentController {
  static addInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.addInstrument(req.body);
    sendResponse(res, 201, "Instrument added successfully", instrument);
  });

  static getInstruments = AsyncHandler(async (req, res, next) => {
    const { instruments, totalDocuments } =
      await InstrumentService.getAllInstrument(req.query);

    sendResponse(
      res,
      200,
      "Instruments fetched successfully",
      instruments,
      totalDocuments
    );
  });

  static getInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.getInstrumentById(req.params.id);
    sendResponse(res, 200, "Instrument fetched successfully", instrument);
  });

  static updateInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.updateInstrument(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Instrument updated sucessfully", instrument);
  });

  static deleteInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.deleteInstrument(req.params.id);
    sendResponse(res, 204, "Instrument deleted sucessfully", instrument);
  });

  static getInstrumentRatifiedByCountries = AsyncHandler(
    async (req, res, next) => {
      // Fetch all countries
      const countries = await Country.find({ deleted_at: null }).select(
        "name _id iso_02"
      );

      // Fetch instrument details (including country ratifications)
      const instrument = await Instrument.findById(
        req.params.instrumentId
      ).select("countryRatifications");

      if (!instrument) {
        throw new Error("Instrument not found");
      }

      // Convert ratifications into a map for easy lookup
      const ratificationMap = {};
      instrument.countryRatifications.forEach((rat) => {
        ratificationMap[rat.countryName] = {
          ratified: rat.ratified,
          ratificationDate: rat.ratified ? rat.ratificationDate : null,
        };
      });

      // Merge countries with their ratification status
      const result = countries.map((country) => ({
        _id: country._id,
        countryName: country.name,
        isoCode: country.iso_02,
        ratified: ratificationMap[country._id]?.ratified || false,
        ratificationDate:
          ratificationMap[country._id]?.ratificationDate || null,
      }));

      sendResponse(
        res,
        200,
        "InstrumentRatifiedByCountries fetched sucessfully",
        result
      );
    }
  );

  static getRatificationHistoryByCountries = AsyncHandler(
    async (req, res, next) => {
      const { id } = req.params;
      let { countryIds } = req.query; // Get from query params

      if (!countryIds) {
        return res
          .status(400)
          .json({ message: "countryIds query parameter is required" });
      }

      // Convert comma-separated string back to an array
      countryIds = countryIds.split(",");

      // Convert countryIds to ObjectId
      const countryObjectIds = countryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const history = await Instrument.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$countryRatifications" },
        {
          $match: {
            "countryRatifications.countryName": { $in: countryObjectIds }, // Match multiple countries
          },
        },
        {
          $lookup: {
            from: "countries", // Ensure this matches the actual collection name
            localField: "countryRatifications.countryName",
            foreignField: "_id",
            as: "countryDetails",
          },
        },
        { $unwind: "$countryDetails" },
        {
          $project: {
            countryName: "$countryDetails.name",
            ratified: "$countryRatifications.ratified",
            ratificationDate: "$countryRatifications.ratificationDate",
            signedDate: "$signedDate",
          },
        },
        { $sort: { ratificationDate: 1 } },
        {
          $group: {
            _id: "$countryName",
            signedDate: { $first: "$signedDate" },
            history: {
              $push: {
                status: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$ratified", true] }, then: "Ratified" },
                      {
                        case: { $eq: ["$ratified", false] },
                        then: "De-Ratified",
                      },
                    ],
                    default: "Not Ratified",
                  },
                },
                period: {
                  start: "$ratificationDate",
                  end: null,
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            countryName: "$_id",
            history: {
              $concatArrays: [
                [
                  {
                    status: "Not Ratified",
                    period: {
                      start: "$signedDate",
                      end: { $arrayElemAt: ["$history.period.start", 0] },
                    },
                  },
                ],
                {
                  $map: {
                    input: "$history",
                    as: "h",
                    in: {
                      status: "$$h.status",
                      period: {
                        start: "$$h.period.start",
                        end: {
                          $cond: {
                            if: {
                              $gt: [
                                {
                                  $indexOfArray: [
                                    "$history.period.start",
                                    "$$h.period.start",
                                  ],
                                },
                                -1,
                              ],
                            },
                            then: {
                              $arrayElemAt: [
                                "$history.period.start",
                                {
                                  $add: [
                                    {
                                      $indexOfArray: [
                                        "$history.period.start",
                                        "$$h.period.start",
                                      ],
                                    },
                                    1,
                                  ],
                                },
                              ],
                            },
                            else: null,
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ]);

      sendResponse(
        res,
        200,
        "Instrument Ratification History fetched successfully",
        history
      );
    }
  );
}

module.exports = InstrumentController;
