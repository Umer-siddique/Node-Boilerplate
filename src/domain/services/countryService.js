const CountryRepository = require("../repositories/countryRepository");
const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const countryRepository = new CountryRepository();

class CountryService {
  static async importCountriesFromFile(user, fileBuffer, fileType) {
    const countries = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      // Parse CSV file from buffer
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
      // Parse Excel file from buffer
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      countries.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each country
    const savedCountries = [];
    for (const country of countries) {
      try {
        const transformedCountry = this.transformCountryData(user, country);

        // Save the country
        const savedCountry = await countryRepository.create(transformedCountry);
        savedCountries.push(savedCountry);
      } catch (error) {
        console.error(`Error processing country: ${country.name}`, error);
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
      status: country["Active"]?.trim() === "Yes",
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
