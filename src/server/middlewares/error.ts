import express from "express";

import { ErrorData, getErrorData } from "src/shared/error";
import { RequestFreeParams } from "src/shared/express";

export const errorMiddleware: express.ErrorRequestHandler<
  RequestFreeParams,
  ErrorData
> = (err, _, response, next) => {
  if (response.headersSent) {
    return next(err);
  }
  const errorData = getErrorData(err);
  response.status(errorData.code).send(errorData);
};
