import express from "express";

import { ErrorResponse, getErrorData } from "@shared/error";
import { RequestFreeParams } from "@shared/express";

export const errorMiddleware: express.ErrorRequestHandler<
  RequestFreeParams,
  ErrorResponse
> = (err, _, response, next) => {
  if (response.headersSent) {
    return next(err);
  }
  const errorData = getErrorData(err);
  response.status(errorData.code).send({ ...errorData, status: "error" });
};
