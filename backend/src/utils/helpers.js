/**
 * Parse pagination params from query string
 */
function parsePagination(query) {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 20;
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Build pagination metadata
 */
function buildPagination(page, limit, totalCount) {
  return {
    page,
    limit,
    total: totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Standard success response
 */
function successResponse(res, data, statusCode = 200, pagination = null) {
  const body = { success: true, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
}

/**
 * Standard error response
 */
function errorResponse(res, message, statusCode = 500) {
  return res.status(statusCode).json({ success: false, error: message });
}

module.exports = { parsePagination, buildPagination, successResponse, errorResponse };
