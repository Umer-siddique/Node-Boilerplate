const InstrumentService = require("../../domain/services/instrumentService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const Country = require("../../domain/entities/Country");
const Instrument = require("../../domain/entities/Instrument");
const { default: mongoose } = require("mongoose");

class InstrumentController {
  // static addInstrumentDetail = AsyncHandler(async (req, res, next) => {
  //   const instrument = await InstrumentService.addInstrumentDetail(req.body);
  //   sendResponse(res, 201, "Instrument saved successfully", instrument);
  // });

  // static addRelatedTreaty = AsyncHandler(async (req, res, next) => {
  //   const relatedTreaty = await InstrumentService.addRelatedTreaty(req.body);
  //   sendResponse(res, 201, "Treaties saved successfully", relatedTreaty);
  // });
  // static addGroups = AsyncHandler(async (req, res, next) => {
  //   const groups = await InstrumentService.addGroups(req.body);
  //   sendResponse(res, 201, "Groups saved successfully", groups);
  // });

  // static getInstrumentsDetail = AsyncHandler(async (req, res, next) => {
  //   const instruments = await InstrumentService.getInstrumentsDetails();
  //   sendResponse(res, 200, "Instruments fetched successfully", instruments);
  // });

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

  static getRatificationHistoryByCountry = AsyncHandler(
    async (req, res, next) => {
      const { id, countryId } = req.params;

      const history = await Instrument.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$countryRatifications" },
        {
          $match: {
            "countryRatifications.countryName": new mongoose.Types.ObjectId(
              countryId
            ),
          },
        },
        {
          $lookup: {
            from: "countries", // Replace with the actual collection name for countries
            localField: "countryRatifications.countryName",
            foreignField: "_id",
            as: "countryDetails",
          },
        },
        { $unwind: "$countryDetails" }, // Unwind the countryDetails array
        {
          $project: {
            countryName: "$countryDetails.name", // Use the country name instead of ID
            ratified: "$countryRatifications.ratified",
            statusChangeDate: "$countryRatifications.statusChangeDate",
            signedDate: "$signedDate", // Include the instrument's signedDate
          },
        },
        { $sort: { statusChangeDate: 1 } }, // Sort changes by time
        {
          $group: {
            _id: "$countryName",
            signedDate: { $first: "$signedDate" }, // Include the signedDate in the group
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
                  start: "$statusChangeDate",
                  end: null, // Will be updated in the next step
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
                      end: {
                        $arrayElemAt: ["$history.period.start", 0],
                      },
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
