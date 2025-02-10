const sendResponse = (res, statusCode, message, data = null, total = null) => {
  const response = {
    status: "success",
    message,
    results: Array.isArray(data) ? data.length : 1,
    data,
  };

  // Include pagination metadata only for paginated queries
  if (total !== null) {
    response.pagination = {
      totalDocuments: total, // Total number of documents
      totalPages: Math.ceil(total / (res.req.query.limit || 10)), // Default limit = 10
      currentPage: Number(res.req.query.page) || 1,
      limit: Number(res.req.query.limit) || 10,
    };
  }

  res.status(statusCode).json(response);
};

module.exports = { sendResponse };
