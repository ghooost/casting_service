import express from "express";

import { serviceCastings } from "@services/castings";
import { Casting } from "@shared/casting";
import { ProcessingError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { selectContext } from "@utils/context";
import { getCompanyByParam, getCastingByParam } from "@utils/params";

interface CastingIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
}

const decodeParams = async (request: express.Request<CastingIdParams>) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  return {
    author,
    company,
  };
};

export const listCastings: express.RequestHandler<
  CastingIdParams,
  Casting[]
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
  const castings = await serviceCastings.getCastingList(author, company);
  response.status(200).send(castings);
};

export const getCasting: express.RequestHandler<
  CastingIdParams,
  Casting
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
  );
  response.status(200).send(casting);
};

export const createCasting: express.RequestHandler<
  CastingIdParams,
  Casting,
  Omit<Casting, "id">
> = async (request, response) => {
  const { author, company } = await decodeParams(request);
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
  const { author, company } = await decodeParams(request);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
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
  const { author, company } = await decodeParams(request);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
  );
  await serviceCastings.deleteCasting(author, company, casting);
  response.status(200).send(defaultOkResponse);
};
