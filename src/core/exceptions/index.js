const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/constants");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
class BadRequestError extends AppError {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST) {
    super(message, STATUS_CODES.BAD_REQUEST);
  }
}

// 401 Unauthorized
class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}

// 403 Forbidden
class ForbiddenError extends AppError {
  constructor(message = ERROR_MESSAGES.FORBIDDEN) {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}

// 404 Not Found
class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_FOUND) {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}

// 409 Conflict
class ConflictError extends AppError {
  constructor(message = ERROR_MESSAGES.CONFLICT) {
    super(message, STATUS_CODES.CONFLICT);
  }
}

// 422 Unprocessable Entity (Validation Error)
class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR, errors = []) {
    super(message, STATUS_CODES.VALIDATION_ERROR);
    this.errors = errors; // Additional validation error details
  }
}

// 429 Too Many Requests (Rate Limit Exceeded)
class RateLimitExceededError extends AppError {
  constructor(message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED) {
    super(message, STATUS_CODES.RATE_LIMIT_EXCEEDED);
  }
}

// 500 Internal Server Error
class InternalServerError extends AppError {
  constructor(message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

// 503 Service Unavailable
class ServiceUnavailableError extends AppError {
  constructor(message = ERROR_MESSAGES.SERVICE_UNAVAILABLE) {
    super(message, STATUS_CODES.SERVICE_UNAVAILABLE);
  }
}

// 501 Not Implemented
class NotImplementedError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_IMPLEMENTED) {
    super(message, STATUS_CODES.NOT_IMPLEMENTED);
  }
}

// Database-Related Errors
class DatabaseError extends AppError {
  constructor(message = ERROR_MESSAGES.DATABASE_ERROR) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitExceededError,
  InternalServerError,
  ServiceUnavailableError,
  NotImplementedError,
  DatabaseError,
};
