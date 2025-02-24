const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to convert Excel serial numbers to dates
const excelSerialToDate = (serial) => {
  if (!serial) return null;

  // Excel's base date is January 1, 1900
  const baseDate = new Date(1900, 0, 1);

  // Add the serial number (minus 1 because Excel considers 1/1/1900 as day 1)
  const date = new Date(
    baseDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000
  );

  return date;
};

module.exports = { generateRandomString, excelSerialToDate };
