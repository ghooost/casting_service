import express from "express";

import { serviceSlotApplicants } from "@services/slotApplicants";
import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import { BodyWithStatus, RequestFreeParams } from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";
import {
  getCastingByParam,
  getCompanyByParam,
  getSlotByParam,
} from "@utils/params";

interface ApplicantIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
  slotId: string;
  applicantId: string;
}

export const getApplicantByParam = async (
  author: MaybeUser,
  company: Company,
  slot: CastingSlot,
  param: string
) => {
  const applicantId = parseInt(param);
  if (!applicantId) {
    throw new NotFoundError();
  }
  const applicant = await serviceSlotApplicants.getApplicantById(
    author,
    company,
    slot,
    applicantId
  );
  if (!applicant) {
    throw new NotFoundError();
  }
  return applicant;
};

const decodeParams = async (request: express.Request<ApplicantIdParams>) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
  );
  const slot = await getSlotByParam(
    author,
    company,
    casting,
    request.params.castingId
  );
  return {
    author,
    company,
    casting,
    slot,
  };
};

export const applicantList: express.RequestHandler<
  ApplicantIdParams,
  Applicant[]
> = async (request, response) => {
  const { author, company, slot } = await decodeParams(request);
  const applicants = await serviceSlotApplicants.getApplicantsList(
    author,
    company,
    slot
  );
  response.status(200).send(applicants);
};

export const applicantGet: express.RequestHandler<
  ApplicantIdParams,
  Applicant
> = async (request, response) => {
  const { author, company, slot } = await decodeParams(request);
  const applicant = await getApplicantByParam(
    author,
    company,
    slot,
    request.params.applicantId
  );
  response.status(200).send(applicant);
};

export const applicantCreate: express.RequestHandler<
  ApplicantIdParams,
  Applicant,
  Omit<Applicant, "id">
> = async (request, response) => {
  const { author, company, slot } = await decodeParams(request);
  const applicant = await serviceSlotApplicants.createApplicant(
    author,
    company,
    request.body
  );
  await serviceSlotApplicants.addApplicantToSlot(
    author,
    company,
    slot,
    applicant
  );

  response.status(200).send(applicant);
};

export const applicantUpdate: express.RequestHandler<
  ApplicantIdParams,
  Applicant,
  Omit<Applicant, "id">
> = async (request, response) => {
  const { author, company, slot } = await decodeParams(request);
  const applicant = await getApplicantByParam(
    author,
    company,
    slot,
    request.params.applicantId
  );

  const result = await serviceSlotApplicants.updateApplicant(
    author,
    company,
    applicant,
    request.body
  );

  if (!result) {
    throw new ProcessingError();
  }

  response.status(200).send(result);
};

export const applicantDelete: express.RequestHandler<
  ApplicantIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author, company, slot } = await decodeParams(request);
  const applicant = await getApplicantByParam(
    author,
    company,
    slot,
    request.params.applicantId
  );
  serviceSlotApplicants.removeApplicantFromCompany(
    author,
    company,
    slot,
    applicant
  );
  response.sendStatus(200);
};
