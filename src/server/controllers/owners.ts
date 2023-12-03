import express from "express";

import { serviceCompanies } from "@services/companies";
import { serviceOwners } from "@services/owners";
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

interface OwnerIdParams extends RequestFreeParams {
  companyId: string;
  ownerId: string;
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

const getOwnerByParam = (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const userId = parseInt(param);
  if (!userId) {
    throw new NotFoundError();
  }
  const user = serviceUsers.getUserById(author, userId);
  if (!company.owners.has(user)) {
    throw new NotFoundError();
  }
  return user;
};

export const listOwners: express.RequestHandler<OwnerIdParams, User[]> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const owners = Array.from(company.owners);
  response.status(200).send(owners.map(maskPrivateData));
};

export const getOwner: express.RequestHandler<OwnerIdParams, User> = (
  request,
  response
) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const owner = getOwnerByParam(author, company, request.params.ownerId);
  response.status(200).send(maskPrivateData(owner));
};

export const createOwner: express.RequestHandler<
  OwnerIdParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const owner = serviceUsers.createUser(author, request.body);
  serviceOwners.addOwnerToCompany(author, company, owner);
  response.status(200).send(maskPrivateData(owner));
};

export const updateOwner: express.RequestHandler<
  OwnerIdParams,
  User,
  Omit<User, "id">
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const owner = getOwnerByParam(author, company, request.params.ownerId);
  serviceUsers.updateUser(author, owner, request.body);
  response.status(200).send(maskPrivateData(owner));
};

export const deleteOwner: express.RequestHandler<
  OwnerIdParams,
  BodyWithStatus
> = (request, response) => {
  const { author } = selectContext(request);
  const company = getCompanyByParam(author, request.params.companyId);
  const owner = getOwnerByParam(author, company, request.params.ownerId);
  serviceOwners.removeOwnerFromCompany(author, company, owner);
  response.status(200).send(defaultOkResponse);
};
