export class HttpError extends Error {
  constructor(status, message, detail = null) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export const badRequest = (msg, detail) => new HttpError(400, msg, detail);
export const notFound = (msg = 'No encontrado') => new HttpError(404, msg);
