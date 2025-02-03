const {
  STATUS_CODES,
  ERROR_MESSAGES,
  ERROR_NAMES,
} = require("../../config/constants");
const { AppError } = require("../exceptions/index");
const { logEvents } = require("../logging/logger");

// Error handlers for specific error types
const handleJwtExpiredError = () => {
  return new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, STATUS_CODES.UNAUTHORIZED);
};

const handleJwtTokenError = () => {
  return new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED);
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, STATUS_CODES.BAD_REQUEST);
};

const handleDuplicateErrorDB = (error) => {
  const value = JSON.stringify(error.keyValue);
  const _value = value.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const __value = _value.split('"')[1];
  const message = `Duplicate field value: ${__value}. Please use another value!`;
  return new AppError(message, STATUS_CODES.BAD_REQUEST);
};

const handleValidationErrorDB = (error) => {
  const validationErr = Object.values(error.errors).map((el) => el.message);
  const message = `${validationErr.join(". ")}`;
  return new AppError(message, STATUS_CODES.VALIDATION_ERROR);
};

// Error response for development environment
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

// Error response for production environment
const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR💥", err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Global error handler middleware
const ErrorHandler = (err, req, res, next) => {
  // Log the errors
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${
      req.headers.origin || "same origin"
    }`,
    "errLog.log"
  );
  console.log(err.stack);

  // Set the errors
  err.statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === ERROR_NAMES.CAST_ERROR) {
      error = handleCastErrorDB(error);
    } else if (err.code === ERROR_NAMES.DUPLICATE_ERROR) {
      error = handleDuplicateErrorDB(error);
    } else if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
      error = handleValidationErrorDB(error);
    } else if (err.name === ERROR_NAMES.JWT_ERROR) {
      error = handleJwtTokenError();
    } else if (err.name === ERROR_NAMES.TOKEN_EXPIRED_ERROR) {
      error = handleJwtExpiredError();
    }

    sendErrProd(error, res);
  }
};

module.exports = ErrorHandler;
