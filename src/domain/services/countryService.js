const CountryRepository = require("../repositories/countryRepository");
const InstrumentRepository = require("../repositories/instrumentRepository");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const { ObjectId } = require("mongodb");

const countryRepository = new CountryRepository();
const instrumentRepository = new InstrumentRepository();

class CountryService {
  static async getAllCountriesMetrics() {
    const { countries } = await countryRepository.findAll({});
    const { instruments } = await instrumentRepository.findAll({});
    const totalInstruments = instruments.length;
    let totalRelevance = 0;

    // Calculate total relevance of all instruments
    instruments.forEach((instrument) => {
      totalRelevance += instrument.relevance;
    });

    const countryMetrics = [];

    // Calculate metrics for each country
    for (const country of countries) {
      let ratifiedCount = 0;
      let ratifiedRelevanceSum = 0;

      instruments.forEach((instrument) => {
        const ratification = instrument.countryRatifications.find((rat) =>
          rat.countryName.equals(new ObjectId(country._id))
        );

        if (ratification) {
          const lastRatification =
            ratification.ratifications[ratification.ratifications.length - 1];
          if (lastRatification.ratified) {
            ratifiedCount++;
            ratifiedRelevanceSum += instrument.relevance;
          }
        }
      });

      const ratificationRate = (
        (ratifiedCount / totalInstruments) *
        100
      ).toFixed(2);
      const countryScore = (
        (ratifiedRelevanceSum / totalRelevance) *
        100
      ).toFixed(2);
      const averageRelevance =
        ratifiedCount > 0
          ? (ratifiedRelevanceSum / ratifiedCount).toFixed(2)
          : 0;

      countryMetrics.push({
        name: country.name,
        iso_02Code: country.iso_02,
        iso_03Code: country.iso_03,
        instruments: ratifiedCount,
        rate: parseFloat(ratificationRate),
        score: parseFloat(countryScore),
        relevants: parseFloat(averageRelevance),
      });
    }

    // **Step 4: Calculate Rank**
    countryMetrics.sort((a, b) => b.score - a.score); // Sort by score (highest first)

    let rank = 1;
    let prevScore = null;
    let rankMap = new Map();

    countryMetrics.forEach((country, index) => {
      if (prevScore !== country.score) {
        rank = index + 1; // Assign rank only if score is different
      }
      rankMap.set(country.name, rank);
      prevScore = country.score;
    });

    // Assign ranks to countryMetrics
    countryMetrics.forEach((country) => {
      country.rank = rankMap.get(country.name);
    });

    return countryMetrics;
  }

  static async importCountriesFromFile(user, fileBuffer, fileType) {
    const countries = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      await new Promise((resolve, reject) => {
        const stream = require("stream");
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        bufferStream
          .pipe(csv())
          .on("data", (row) => countries.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      countries.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save/update each country
    const savedCountries = [];
    for (const country of countries) {
      try {
        const transformedCountry = this.transformCountryData(user, country);

        // Check if the country already exists by name (or ISO 2 if preferred)
        const existingCountry = await countryRepository.findByName(
          transformedCountry.name
        );

        let savedCountry;
        if (existingCountry) {
          // Update existing country
          savedCountry = await countryRepository.update(
            existingCountry._id,
            transformedCountry
          );
        } else {
          // Create new country
          savedCountry = await countryRepository.create(transformedCountry);
        }

        savedCountries.push(savedCountry);
      } catch (error) {
        console.error(`Error processing country: ${country.Name}`, error);
      }
    }

    return savedCountries;
  }

  // Helper function to transform country data
  static transformCountryData(user, country) {
    return {
      name: country["Name"]?.trim(),
      iso_02: country["ISO 2"]?.trim(),
      iso_03: country["ISO 3"]?.trim(),
      iso_03_num: country["ISO 3 Num"]?.toString(),
      continent: country["Continent"]?.trim(),
      status: Boolean(country["Active"]),
      user,
    };
  }

  static async addCountry(countryData) {
    return await countryRepository.add(countryData);
  }

  static async getAllCountry(queryStr) {
    return await countryRepository.findAll(queryStr);
  }
  static async getAllCountries(queryStr) {
    return await countryRepository.findAllWithoutFilters(queryStr);
  }

  static async getCountryById(countryId) {
    return await countryRepository.findById(countryId);
  }
  static async updateCountry(countryId, updateData) {
    return await countryRepository.update(countryId, updateData);
  }
  static async deleteCountry(countryId) {
    return await countryRepository.delete(countryId);
  }
}

module.exports = CountryService;
