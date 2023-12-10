import express from "express";

import { serviceSessions } from "@services/sessions";
import { serviceUsers } from "@services/users";
import { SignInRequestBody, SignInResponseBody } from "@shared/auth";
import { ForbiddenError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  defaultWrongResponse,
  RequestFreeParams,
} from "@shared/express";
import { selectContext } from "@utils/context";

export const signIn: express.RequestHandler<
  RequestFreeParams,
  SignInResponseBody,
  SignInRequestBody
> = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    await serviceUsers.coreCreateInitialUserIfNoUsersAtAll(email, password);

    const author = await serviceUsers.coreGetUserByEmail(email);
    if (!author) {
      throw new ForbiddenError("wrong login/password");
    }
    if (author.password !== password) {
      throw new ForbiddenError("wrong login/password");
    }
    const session = await serviceSessions.createSession(author.id);
    if (!session) {
      throw new ProgressEvent("no session created");
    }
    const context = selectContext(request);
    context.author = author;
    context.session = session;

    response.status(200).send({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
};

export const signOut: express.RequestHandler<
  RequestFreeParams,
  BodyWithStatus
> = async (request, response, next) => {
  try {
    const { session } = selectContext(request);
    if (!session) {
      throw new ForbiddenError();
    }
    await serviceSessions.deleteSession(session);
    const context = selectContext(request);
    context.author = null;
    context.session = null;
    response.status(200).send(defaultOkResponse);
  } catch (error) {
    next(error);
  }
};

export const checkSession: express.RequestHandler<
  RequestFreeParams,
  BodyWithStatus
> = async (request, response, next) => {
  try {
    const { session } = selectContext(request);
    if (!session) {
      response.status(200).send(defaultWrongResponse);
      return;
    }
    response.status(200).send(defaultOkResponse);
  } catch (error) {
    next(error);
  }
};
