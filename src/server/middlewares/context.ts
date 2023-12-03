import express from "express";

import { RequestWithContext } from "src/shared/context";

export const contextMiddleware: express.RequestHandler = (request, _, next) => {
  (request as RequestWithContext).context = {
    session: null,
    author: null,
  };
  next();
};
