module.exports = {
  // User Roles
  ROLES: {
    SUPERADMIN: "superadmin",
    ADMIN: "admin",
    DATAMANAGER: "datamanager",
    USER: "user",
  },

  // HTTP Status Codes
  STATUS_CODES: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    RATE_LIMIT_EXCEEDED: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    NOT_IMPLEMENTED: 501,
  },

  // Error Messages
  ERROR_MESSAGES: {
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict",
    VALIDATION_ERROR: "Validation Error",
    RATE_LIMIT_EXCEEDED: "Rate Limit Exceeded",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    SERVICE_UNAVAILABLE: "Service Unavailable",
    NOT_IMPLEMENTED: "Not Implemented",
    DATABASE_ERROR: "Database Error",
  },
};
