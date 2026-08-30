/**
 * Express error-handling middleware. Maps known error types (NotFoundError,
 * ValidationError - both carry a `statusCode`) to their HTTP status, and
 * falls back to 500 for anything unexpected.
 * @param {Error & {statusCode?: number}} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode ?? 500;
  if (statusCode === 500) {
    console.error(err);
  }
  res.status(statusCode).json({ error: err.message || "Internal server error" });
}

module.exports = errorHandler;
