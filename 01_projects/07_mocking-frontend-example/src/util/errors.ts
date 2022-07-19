export class HttpError {
  statusCode: number;
  message: string;
  data: any;

  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ValidationError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
