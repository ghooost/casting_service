import { adapterCompanies } from "@db/companies";
import {
  checkAuthOwnerWithCompany,
  checkAuthAdmin,
  canManageStuffLevel,
} from "@utils/auth";
import { Company } from "src/shared/company";
import { ForbiddenError, NotFoundError } from "src/shared/error";
import { MaybeUser } from "src/shared/user";

const getCompaniesList = async (author: MaybeUser) => {
  if (!author) {
    throw new ForbiddenError();
  }
  if (author.isAdmin) {
    return adapterCompanies.filter();
  }
  return await adapterCompanies.filter(
    async (company) => await canManageStuffLevel(author, company)
  );
};

const getCompanyById = async (author: MaybeUser, companyId: Company["id"]) => {
  if (!author) {
    throw new ForbiddenError();
  }
  const company = await adapterCompanies.find(companyId);
  if (!company) {
    throw new NotFoundError();
  }
  if (author.isAdmin) {
    return company;
  }
  if (!(await canManageStuffLevel(author, company))) {
    throw new ForbiddenError();
  }
  return company;
};

const createCompany = async (data: Pick<Company, "title">) => {
  return await adapterCompanies.add(data);
};

const updateCompany = async (
  company: Company,
  data: Pick<Company, "title">
) => {
  return await adapterCompanies.update(company.id, data);
};

const deleteCompany = async (company: Company) => {
  await adapterCompanies.remove(company);
};

export const serviceCompanies = {
  getCompaniesList,
  getCompanyById,
  createCompany: checkAuthAdmin(createCompany),
  deleteCompany: checkAuthAdmin(deleteCompany),
  updateCompany: checkAuthOwnerWithCompany(updateCompany),
};
