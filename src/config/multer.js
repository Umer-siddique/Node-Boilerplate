const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    // Set the filename to avoid conflicts (e.g., using a timestamp)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Filter to allow only specific file types (e.g., CSV or Excel)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "text/csv", // CSV files
    "application/vnd.ms-excel", // Excel (older format)
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (newer format)
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only CSV and Excel files are allowed."),
      false
    );
  }
};

// Configure multer with the storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

module.exports = upload;
