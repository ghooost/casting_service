import { selectCollection, uniqId } from "@db/index";
import { checkAuthOwnerWithCompany, checkAuthAdmin } from "@utils/auth";
import { Company } from "src/shared/company";
import { ForbiddenError, NotFoundError } from "src/shared/error";
import { MaybeUser } from "src/shared/user";

const getCompaniesList = (author: MaybeUser) => {
  if (!author) {
    throw new ForbiddenError();
  }
  const companiesCollection = selectCollection("companies");
  const companies = Array.from(companiesCollection.values());
  if (author.isAdmin) {
    return companies;
  }
  return companies.filter(
    (company) => company.owners.has(author) || company.stuff.has(author)
  );
};

const getCompanyById = (author: MaybeUser, companyId: Company["id"]) => {
  if (!author) {
    throw new ForbiddenError();
  }
  const companiesCollection = selectCollection("companies");
  const company = companiesCollection.get(companyId);
  if (!company) {
    throw new NotFoundError();
  }
  if (author.isAdmin) {
    return company;
  }
  if (!company.owners.has(author) && !company.stuff.has(author)) {
    throw new ForbiddenError();
  }
  return company;
};

const createCompany = (data: Pick<Company, "title">) => {
  const companiesCollection = selectCollection("companies");
  const company: Company = {
    id: uniqId(),
    ...data,
    owners: new Set(),
    stuff: new Set(),
    castings: new Set(),
  };
  companiesCollection.set(company.id, company);
  return company;
};

const updateCompany = (company: Company, data: Pick<Company, "title">) => {
  company.title = data.title;
  return company;
};

const deleteCompany = (company: Company) => {
  const companiesCollection = selectCollection("companies");
  companiesCollection.delete(company.id);
};

export const serviceCompanies = {
  getCompaniesList,
  getCompanyById,
  createCompany: checkAuthAdmin(createCompany),
  deleteCompany: checkAuthAdmin(deleteCompany),
  updateCompany: checkAuthOwnerWithCompany(updateCompany),
};
