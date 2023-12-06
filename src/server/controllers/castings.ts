import express from "express";

import { serviceCastings } from "@services/castings";
import { serviceCompanies } from "@services/companies";
import { Casting } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";

interface CastingIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
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

const getCastingByParam = async (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const castingId = parseInt(param);
  if (!castingId) {
    throw new NotFoundError();
  }
  const casting = await serviceCastings.getCastingById(
    author,
    company,
    castingId
  );
  if (!casting) {
    throw new NotFoundError();
  }
  return casting;
};

export const listCastings: express.RequestHandler<
  CastingIdParams,
  Casting[]
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const castings = await serviceCastings.getCastingList(author, company);
  response.status(200).send(castings);
};

export const getCasting: express.RequestHandler<
  CastingIdParams,
  Casting
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.ownerId
  );
  response.status(200).send(casting);
};

export const createCasting: express.RequestHandler<
  CastingIdParams,
  Casting,
  Omit<Casting, "id">
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await serviceCastings.createCasting(
    author,
    company,
    request.body
  );
  response.status(200).send(casting);
};

export const updateCasting: express.RequestHandler<
  CastingIdParams,
  Casting,
  Partial<Omit<Casting, "id">>
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.ownerId
  );
  const result = await serviceCastings.updateCasting(
    author,
    company,
    casting,
    request.body
  );
  if (!result) {
    throw new ProcessingError();
  }
  response.status(200).send(result);
};

export const deleteCasting: express.RequestHandler<
  CastingIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.ownerId
  );
  await serviceCastings.deleteCasting(author, company, casting);
  response.status(200).send(defaultOkResponse);
};
