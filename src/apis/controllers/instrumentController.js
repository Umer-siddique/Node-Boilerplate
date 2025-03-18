const { default: mongoose } = require("mongoose");
const InstrumentService = require("../../domain/services/instrumentService");
const { BadRequestError } = require("../../core/exceptions");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const Country = require("../../domain/entities/Country");
const Instrument = require("../../domain/entities/Instrument");

class InstrumentController {
  static getRatificaitonCountsByYears = AsyncHandler(async (req, res, next) => {
    const { instrumentId } = req.query; // Get the instrument _id (as a string) from query parameters

    if (!instrumentId) {
      throw new BadRequestError("Instrument ID is required");
    }

    const ratificationsCountByYear =
      await InstrumentService.getRatificationsCountByYear(instrumentId);
    res.json(ratificationsCountByYear);
  });

  static getCountryProfileData = AsyncHandler(async (req, res, next) => {
    const { countryId } = req.params;
    const data = await InstrumentService.getCountryData(countryId);
    res.status(200).json(data);
  });

  static addInstrument = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const instrument = await InstrumentService.addInstrument(
      {
        ...req.body,
        user,
      },
      user
    );
    sendResponse(res, 201, "Instrument added successfully", instrument);
  });

  static importInstruments = AsyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("Please upload a file!");
    }

    // Call the service to process the file
    const result = await InstrumentService.importInstrumentsFromFile(
      req.user._id,
      file.buffer, // Pass the file buffer
      file.mimetype // Pass the file MIME type
    );

    res.status(200).json({
      message: "Instruments imported successfully",
      data: result,
    });
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

  static getInstrumentsTotalRatificaitons = AsyncHandler(
    async (req, res, next) => {
      const totalOverallRatificaitons =
        await InstrumentService.getInstrumentsTotalRatificaitons();

      res.status(200).json({
        status: "success",
        overallRatifications: totalOverallRatificaitons,
      });
    }
  );

  static getInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.getInstrumentById(req.params.id);
    sendResponse(res, 200, "Instrument fetched successfully", instrument);
  });

  static updateInstrument = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const instrument = await InstrumentService.updateInstrument(
      req.params.id,
      { ...req.body, user },
      user
    );
    sendResponse(res, 200, "Instrument updated sucessfully", instrument);
  });

  static deleteInstrument = AsyncHandler(async (req, res, next) => {
    const instrument = await InstrumentService.deleteInstrument(
      req.params.id,
      req.user._id
    );
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
      instrument.countryRatifications.forEach((country) => {
        // Find the latest ratification entry for the country
        const latestRatification = country.ratifications.reduce(
          (latest, current) => {
            if (!latest || current.ratificationDate > latest.ratificationDate) {
              return current;
            }
            return latest;
          },
          null
        );

        // Store the latest ratification status in the map
        ratificationMap[country.countryName.toString()] = {
          ratified: latestRatification ? latestRatification.ratified : false,
          ratificationDate: latestRatification
            ? latestRatification.ratificationDate
            : null,
        };
      });

      // Merge countries with their ratification status
      const result = countries.map((country) => ({
        _id: country._id,
        countryName: country.name,
        isoCode: country.iso_02,
        ratified: ratificationMap[country._id.toString()]?.ratified || false,
        ratificationDate:
          ratificationMap[country._id.toString()]?.ratificationDate || null,
      }));

      sendResponse(
        res,
        200,
        "InstrumentRatifiedByCountries fetched successfully",
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
        // Match the instrument by ID
        { $match: { _id: new mongoose.Types.ObjectId(id) } },

        // Unwind the countryRatifications array
        { $unwind: "$countryRatifications" },

        // Match only the specified countries
        {
          $match: {
            "countryRatifications.countryName": { $in: countryObjectIds },
          },
        },

        // Unwind the ratifications array for each country
        { $unwind: "$countryRatifications.ratifications" },

        // Lookup country details
        {
          $lookup: {
            from: "countries", // Ensure this matches the actual collection name
            localField: "countryRatifications.countryName",
            foreignField: "_id",
            as: "countryDetails",
          },
        },

        // Unwind the countryDetails array
        { $unwind: "$countryDetails" },

        // Project the required fields
        {
          $project: {
            countryName: "$countryDetails.name",
            ratified: "$countryRatifications.ratifications.ratified",
            ratificationDate:
              "$countryRatifications.ratifications.ratificationDate",
            signedDate: "$signedDate",
          },
        },

        // Sort by ratificationDate
        { $sort: { ratificationDate: 1 } },

        // Group by countryName and build the history array
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
                        then: "Not Ratified",
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

        // Add the initial "Not Ratified" period and calculate end dates
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
