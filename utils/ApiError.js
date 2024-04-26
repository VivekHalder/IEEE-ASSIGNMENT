export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something wrong happened.",
    errors = [],
    stack,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = stack;
    }
  }
}
