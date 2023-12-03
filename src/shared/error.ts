class ErrorWithDescription extends Error {
  public description;
  constructor(message?: string, description?: string) {
    super(message);
    this.description = description;
  }
}

export class HttpError extends ErrorWithDescription {
  public code: number;
  constructor(code: number, message?: string, description?: string) {
    super(message ?? "", description);
    this.code = code;
  }
}

export class ParamsError extends ErrorWithDescription {}
export class NotFoundError extends ErrorWithDescription {}
export class UnauthorizedError extends ErrorWithDescription {}
export class ForbiddenError extends ErrorWithDescription {}
export class ProcessingError extends ErrorWithDescription {}

const ErrorDataByType = [
  { type: ParamsError, code: 400, message: "Bad Request" },
  {
    type: UnauthorizedError,
    code: 401,
    message: "Authentication Required",
  },
  { type: ForbiddenError, code: 403, message: "Forbidden" },
  { type: NotFoundError, code: 404, message: "Not Found" },
  { type: ProcessingError, code: 500, message: "Recognised error" },
  { type: Error, code: 500, message: "Internal error" },
];

interface MaybeMessageAndDescription {
  message?: string;
  description?: string;
}

export interface ErrorData {
  code: number;
  message: string;
  description?: string;
}

export const getErrorData = (err: MaybeMessageAndDescription) => {
  const data = ErrorDataByType.find(({ type }) => err instanceof type);
  if (!data) {
    return { code: 500, message: "Unknown Error" };
  }
  const body: ErrorData = { code: data.code, message: data.message };
  if (err.message) {
    body.message = err.message;
  }
  if (err.description) {
    body.description = err.description;
  }
  return body;
};
