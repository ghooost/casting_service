import express from "express";

import { serviceStuff } from "@services/stuff";
import { serviceUsers } from "@services/users";
import { Company } from "@shared/company";
import { NotFoundError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { MaybeUser, User } from "@shared/user";
import { selectContext } from "@utils/context";
import { getCompanyByParam } from "@utils/params";
import { maskPrivateData } from "@utils/users";

interface StuffIdParams extends RequestFreeParams {
  companyId: string;
  stuffId: string;
}

const getStuffByParam = async (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const userId = parseInt(param);
  if (!userId) {
    throw new NotFoundError();
  }
  const user = await serviceStuff.getStuffById(author, company, userId);
  if (!user) {
    throw new NotFoundError(`${userId} ${JSON.stringify(user)}`);
  }
  return user;
};

const decodeParams = async (request: express.Request<StuffIdParams>) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  return {
    author,
    company,
  };
};

export const listStuff: express.RequestHandler<StuffIdParams, User[]> = async (
  request,
  response
) => {
  const { author, company } = await decodeParams(request);
  const stuff = await serviceStuff.getStuffList(author, company);
  response.status(200).send(stuff.map(maskPrivateData));
};

export const getStuff: express.RequestHandler<StuffIdParams, User> = async (
  request,
  response
) => {
  const { author, company } = await decodeParams(request);
  const stuff = await getStuffByParam(author, company, request.params.stuffId);
  response.status(200).send(maskPrivateData(stuff));
};

export const createStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
  const user = await serviceUsers.createCompanyUser(
    author,
    company,
    request.body
  );
  await serviceStuff.addStuffToCompany(author, company, user);
  response.status(200).send(maskPrivateData(user));
};

export const updateStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
  const user = await getStuffByParam(author, company, request.params.stuffId);
  await serviceUsers.updateCompanyUser(author, company, user, request.body);
  response.status(200).send(maskPrivateData(user));
};

export const deleteStuff: express.RequestHandler<
  StuffIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
  const user = await getStuffByParam(author, company, request.params.stuffId);
  await serviceStuff.removeStuffFromCompany(author, company, user);
  response.status(200).send(defaultOkResponse);
};
