import { adapterCompanies } from "@db/companies";
import {
  checkAuthOwnerWithCompany,
  checkAuthAdmin,
  canManageStuffLevel,
} from "@utils/auth";
import { Company } from "src/shared/company";
import { ForbiddenError, NotFoundError } from "src/shared/error";
import { MaybeUser } from "src/shared/user";

const getCompaniesList = (author: MaybeUser) => {
  if (!author) {
    throw new ForbiddenError();
  }
  if (author.isAdmin) {
    return adapterCompanies.filter();
  }
  return adapterCompanies.filter((company) =>
    canManageStuffLevel(author, company)
  );
};

const getCompanyById = (author: MaybeUser, companyId: Company["id"]) => {
  if (!author) {
    throw new ForbiddenError();
  }
  const company = adapterCompanies.find(companyId);
  if (!company) {
    throw new NotFoundError();
  }
  if (author.isAdmin) {
    return company;
  }
  if (!canManageStuffLevel(author, company)) {
    throw new ForbiddenError();
  }
  return company;
};

const createCompany = (data: Pick<Company, "title">) => {
  return adapterCompanies.add(data);
};

const updateCompany = (company: Company, data: Pick<Company, "title">) => {
  return adapterCompanies.update(company.id, data);
};

const deleteCompany = (company: Company) => {
  adapterCompanies.remove(company);
};

export const serviceCompanies = {
  getCompaniesList,
  getCompanyById,
  createCompany: checkAuthAdmin(createCompany),
  deleteCompany: checkAuthAdmin(deleteCompany),
  updateCompany: checkAuthOwnerWithCompany(updateCompany),
};
