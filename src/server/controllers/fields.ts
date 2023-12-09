import express from "express";

import { serviceFields } from "@services/fields";
import { Casting, CastingField } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import { BodyWithStatus, RequestFreeParams } from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";
import { getCastingByParam, getCompanyByParam } from "@utils/params";

interface FieldIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
  fieldId: string;
}

export const getFieldByParam = async (
  author: MaybeUser,
  company: Company,
  casting: Casting,
  param: string
) => {
  const fieldId = parseInt(param);
  if (!fieldId) {
    throw new NotFoundError();
  }
  const field = await serviceFields.getFieldById(
    author,
    company,
    casting,
    fieldId
  );
  if (!field) {
    throw new NotFoundError();
  }
  return field;
};

const decodeParams = async (request: express.Request<FieldIdParams>) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
  );
  return {
    author,
    company,
    casting,
  };
};

export const fieldList: express.RequestHandler<
  FieldIdParams,
  CastingField[]
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const fields = await serviceFields.getFieldsList(author, company, casting);
  response.status(200).send(fields);
};

export const fieldGet: express.RequestHandler<
  FieldIdParams,
  CastingField
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const field = await serviceFields.getFieldById(
    author,
    company,
    casting,
    parseInt(request.params.fieldId)
  );
  response.status(200).send(field);
};

export const fieldCreate: express.RequestHandler<
  FieldIdParams,
  CastingField,
  Omit<CastingField, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const field = await serviceFields.createField(
    author,
    company,
    casting,
    request.body
  );
  response.status(200).send(field);
};

export const fieldUpdate: express.RequestHandler<
  FieldIdParams,
  CastingField,
  Omit<CastingField, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const field = await serviceFields.getFieldById(
    author,
    company,
    casting,
    parseInt(request.params.fieldId)
  );

  const result = await serviceFields.updateField(
    author,
    company,
    casting,
    field,
    request.body
  );

  if (!result) {
    throw new ProcessingError();
  }

  response.status(200).send(result);
};

export const fieldDelete: express.RequestHandler<
  FieldIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const field = await serviceFields.getFieldById(
    author,
    company,
    casting,
    parseInt(request.params.fieldId)
  );
  serviceFields.deleteField(author, company, casting, field);
  response.sendStatus(200);
};
