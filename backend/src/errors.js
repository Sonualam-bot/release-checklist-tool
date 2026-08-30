/**
 * Thrown by the service layer when a requested release doesn't exist.
 * Mapped to HTTP 404 by the error-handling middleware.
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

/**
 * Thrown by the service layer when request input fails validation.
 * Mapped to HTTP 400 by the error-handling middleware.
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

module.exports = { NotFoundError, ValidationError };
