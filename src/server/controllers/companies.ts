import express from "express";

import { serviceCompanies } from "@services/companies";
import { Company, CompanyMinData } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import {
  BodyWithStatus,
  defaultOkResponse,
  RequestFreeParams,
} from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";

interface CompanyIdParams extends RequestFreeParams {
  companyId: string;
}

const maskCompanyExtendedData = ({ id, title }: Company) => ({
  id,
  title,
});

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

export const listCompanies: express.RequestHandler<
  RequestFreeParams,
  CompanyMinData[]
> = async (request, response) => {
  const { author } = selectContext(request);
  const companies = await serviceCompanies.getCompaniesList(author);
  response.status(200).send(companies.map(maskCompanyExtendedData));
};

export const getCompany: express.RequestHandler<
  CompanyIdParams,
  CompanyMinData
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  response.status(200).send(maskCompanyExtendedData(company));
};

export const createCompany: express.RequestHandler<
  RequestFreeParams,
  CompanyMinData,
  Pick<Company, "title">
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await serviceCompanies.createCompany(author, request.body);
  response.status(200).send(maskCompanyExtendedData(company));
};

export const updateCompany: express.RequestHandler<
  CompanyIdParams,
  CompanyMinData,
  Pick<Company, "title">
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const result = await serviceCompanies.updateCompany(
    author,
    company,
    request.body
  );
  if (!result) {
    throw new ProcessingError();
  }
  response.status(200).send(maskCompanyExtendedData(result));
};

export const deleteCompany: express.RequestHandler<
  CompanyIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  await serviceCompanies.deleteCompany(author, company);
  response.status(200).send(defaultOkResponse);
};
