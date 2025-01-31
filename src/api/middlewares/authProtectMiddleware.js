const ErrorHandler = require("../utils/ErrorHandler");

const authProtectMiddleware = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};

module.exports = authProtectMiddleware;
