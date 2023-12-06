import express from "express";

import { serviceCompanies } from "@services/companies";
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
import { maskPrivateData } from "@utils/users";

interface StuffIdParams extends RequestFreeParams {
  companyId: string;
  stuffId: string;
}

const getCompanyByParam = async (author: MaybeUser, param: string) => {
  const companyId = parseInt(param);
  if (!companyId) {
    throw new NotFoundError();
  }
  const company = await serviceCompanies.getCompanyById(author, companyId);
  if (!company) {
    throw new NotFoundError();
  }
  return company;
};

const getStuffByParam = async (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const userId = parseInt(param);
  if (!userId) {
    throw new NotFoundError();
  }
  const user = await serviceUsers.getUserById(author, userId);
  if (!(await serviceStuff.has(author, company, user))) {
    throw new NotFoundError();
  }
  return user;
};

export const listStuff: express.RequestHandler<StuffIdParams, User[]> = async (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const stuff = await serviceStuff.getStuffList(author, company);
  response.status(200).send(stuff.map(maskPrivateData));
};

export const getStuff: express.RequestHandler<StuffIdParams, User> = async (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const stuff = await getStuffByParam(author, company, request.params.stuffId);
  response.status(200).send(maskPrivateData(stuff));
};

export const createStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const user = await serviceUsers.createUser(author, request.body);
  await serviceStuff.addStuffToCompany(author, company, user);
  response.status(200).send(maskPrivateData(user));
};

export const updateStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const user = await getStuffByParam(author, company, request.params.stuffId);
  await serviceUsers.updateUser(author, user, request.body);
  response.status(200).send(maskPrivateData(user));
};

export const deleteStuff: express.RequestHandler<
  StuffIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const user = await getStuffByParam(author, company, request.params.stuffId);
  await serviceStuff.removeStuffFromCompany(author, company, user);
  response.status(200).send(defaultOkResponse);
};
