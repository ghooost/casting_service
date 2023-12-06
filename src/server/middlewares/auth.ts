import express from "express";

import { serviceSessions } from "@services/sessions";
import { serviceUsers } from "@services/users";
import { selectContext } from "@utils/context";

export const authMiddleware: express.RequestHandler = async (
  request,
  _,
  next
) => {
  const context = selectContext(request);
  const session = await serviceSessions.getSessionById(
    request.headers?.authorization
  );

  if (session) {
    await serviceSessions.updateSession(session);
    context.session = session;
    context.author = await serviceUsers.coreGetUserById(session.userId);
  }
  next();
};
