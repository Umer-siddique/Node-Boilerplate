const { customAlphabet } = require("nanoid");

const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Only digits, 6 characters long

const generateUUID = () => {
  const generator = customAlphabet("0123456789", 6);
  return generator();
};

// Helper function to convert Excel serial numbers to dates
const excelSerialToDate = (serial) => {
  if (!serial) return null;

  // If the input is a number, treat it as an Excel serial number
  if (typeof serial === "number") {
    // Excel's base date is January 1, 1900
    const baseDate = new Date(1900, 0, 1);

    // Add the serial number (minus 1 because Excel considers 1/1/1900 as day 1)
    const date = new Date(
      baseDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000
    );
    return date;
  }

  // If the input is a string, treat it as a date string (e.g., "2/1/2024")
  if (typeof serial === "string") {
    // Split the date string into month, day, and year
    const [month, day, year] = serial.split("/");

    // Create a Date object (months are 0-indexed in JavaScript)
    return new Date(year, month - 1, day);
  }

  // If the input is neither a number nor a string, return null
  return null;
};

module.exports = { generateRandomString, excelSerialToDate, generateUUID };
