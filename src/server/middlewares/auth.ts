import express from "express";

import { serviceSessions } from "@services/sessions";
import { serviceUsers } from "@services/users";
import { selectContext } from "@utils/context";

export const authMiddleware: express.RequestHandler = (request, _, next) => {
  const context = selectContext(request);
  const session = serviceSessions.getSessionById(
    request.headers?.authorization
  );

  if (session) {
    serviceSessions.updateSession(session);
    context.session = session;
    context.author = serviceUsers.coreGetUserById(session.userId);
  }
  next();
};
