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

const getCompanyByParam = (author: MaybeUser, param: string) => {
  const companyId = parseInt(param);
  if (!companyId) {
    throw new NotFoundError();
  }
  const company = serviceCompanies.getCompanyById(author, companyId);
  if (!company) {
    throw new NotFoundError();
  }
  return company;
};

const getStuffByParam = (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const userId = parseInt(param);
  if (!userId) {
    throw new NotFoundError();
  }
  const user = serviceUsers.getUserById(author, userId);
  if (!company.stuff.has(user)) {
    throw new NotFoundError();
  }
  return user;
};

export const listStuff: express.RequestHandler<StuffIdParams, User[]> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const stuff = Array.from(company.stuff);
  response.status(200).send(stuff.map(maskPrivateData));
};

export const getStuff: express.RequestHandler<StuffIdParams, User> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const stuff = getStuffByParam(author, company, request.params.stuffId);
  response.status(200).send(maskPrivateData(stuff));
};

export const createStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const user = serviceUsers.createUser(author, request.body);
  serviceStuff.addStuffToCompany(author, company, user);
  response.status(200).send(maskPrivateData(user));
};

export const updateStuff: express.RequestHandler<
  StuffIdParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const user = getStuffByParam(author, company, request.params.stuffId);
  serviceUsers.updateUser(author, user, request.body);
  response.status(200).send(maskPrivateData(user));
};

export const deleteStuff: express.RequestHandler<
  StuffIdParams,
  BodyWithStatus
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const user = getStuffByParam(author, company, request.params.stuffId);
  serviceStuff.removeStuffFromCompany(author, company, user);
  response.status(200).send(defaultOkResponse);
};
