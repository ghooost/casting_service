import express from "express";

import { serviceSessions } from "@services/sessions";
import { serviceUsers } from "@services/users";
import { ForbiddenError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { Session } from "@shared/session";
import { User } from "@shared/user";
import { selectContext } from "@utils/context";
import { dumpDb } from "@db/index";

interface SignInRequestBody {
  email: User["email"];
  password: User["password"];
}

interface SignInResponseBody {
  sessionId: Session["id"];
}

export const signIn: express.RequestHandler<
  RequestFreeParams,
  SignInResponseBody,
  SignInRequestBody
> = (request, response) => {
  const { email, password } = request.body;
  serviceUsers.coreCreateInitialUserIfNoUsersAtAll(email, password);

  const author = serviceUsers.coreGetUserByEmail(email);
  if (!author) {
    throw new ForbiddenError("wrong login/password");
  }
  if (author.password !== password) {
    throw new ForbiddenError("wrong login/password");
  }
  const session = serviceSessions.createSession(author.id);
  if (!session) {
    throw new ProgressEvent("no session created");
  }
  const context = selectContext(request);
  context.author = author;
  context.session = session;
  console.log("---------");
  dumpDb();

  response.status(200).send({ sessionId: session.id });
};

export const signOut: express.RequestHandler<
  RequestFreeParams,
  BodyWithStatus
> = (request, response) => {
  const { session } = selectContext(request);
  if (!session) {
    return;
  }
  serviceSessions.deleteSession(session);
  const context = selectContext(request);
  context.author = null;
  context.session = null;
  response.status(200).send(defaultOkResponse);
};
