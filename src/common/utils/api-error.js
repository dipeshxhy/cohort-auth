class APIError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new APIError(400, message);
  }
  static unAuthorized(message = "Unauthorized") {
    return new APIError(401, message);
  }
  static conflict(message = "conflict") {
    return new APIError(409, message);
  }
  static forbidden(message = "Forbidden") {
    return new APIError(412, message);
  }
  static internal(message = "Internal server error") {
    return new APIError(500, message);
  }
  static notFound(message = "Resource not found") {
    return new APIError(404, message);
  }
}
export default APIError;
