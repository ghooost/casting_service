import express from "express";

import { serviceUsers } from "@services/users";
import { NotFoundError, ParamsError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { User } from "@shared/user";
import { selectContext } from "@utils/context";
import { maskPrivateData } from "@utils/users";

interface UserIdParams extends RequestFreeParams {
  userId: string;
}

export const listUsers: express.RequestHandler<RequestFreeParams, User[]> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const users = serviceUsers.getUserList(author);
  response.status(200).send(users.map(maskPrivateData));
};

export const getUser: express.RequestHandler<UserIdParams, User> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const userId = parseInt(request.params.userId);
  if (!userId) {
    throw new ParamsError("no valid userId provided");
  }
  const user = serviceUsers.getUserById(author, userId);
  if (!user) {
    throw new NotFoundError("no user found");
  }
  response.status(200).send(maskPrivateData(user));
};

export const createUser: express.RequestHandler<
  RequestFreeParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const userData = request.body;
  const user = serviceUsers.createUser(author, userData);
  response.status(200).send(maskPrivateData(user));
};

export const updateUser: express.RequestHandler<
  UserIdParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const userId = parseInt(request.params.userId);
  if (!userId) {
    throw new NotFoundError();
  }
  const user = serviceUsers.getUserById(author, userId);
  if (!user) {
    throw new NotFoundError();
  }
  const userData = request.body;
  const result = serviceUsers.updateUser(author, user, userData);
  response.status(200).send(maskPrivateData(result));
};

export const deleteUser: express.RequestHandler<
  UserIdParams,
  BodyWithStatus
> = (request, response) => {
  const { author } = selectContext(request);
  const userId = parseInt(request.params.userId);
  const user = serviceUsers.getUserById(author, userId);
  if (!user) {
    throw new NotFoundError();
  }
  serviceUsers.deleteUser(author, user);
  response.status(200).send(defaultOkResponse);
};
