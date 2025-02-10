const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: "success",
    message,
    results: data.length,
    data,
  });
};

module.exports = { sendResponse };
