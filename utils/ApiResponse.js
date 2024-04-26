export class ApiResponse {
  constructor(statusCode, data, message) {
    this.stausCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 400;
  }
}
