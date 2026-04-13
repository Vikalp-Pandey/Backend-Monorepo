import { ErrorName } from './constants';

import type { ContentfulStatusCode } from 'hono/utils/http-status';

export default class HttpError extends Error {
  name: ErrorName;
  message: string;
  statusCode: ContentfulStatusCode;

  constructor(
    statusCode: ContentfulStatusCode,
    message: string,
    name: ErrorName,
  ) {
    super(message);

    this.name = name;
    this.message = message;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toResponseJSON() {
    return {
      success: false,
      error: ErrorName[this.name],
      message: this.message,
      stack: this.stack,
    };
  }
}
