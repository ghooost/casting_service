import { adapterOwners } from "@db/companies";
import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getOwnerList = async (company: Company) => {
  return await adapterOwners.filter(company);
};

const addOwnerToCompany = async (company: Company, user: User) => {
  await adapterOwners.link(company, user);
  return company;
};

const removeOwnerFromCompany = async (company: Company, user: User) => {
  await adapterOwners.unlink(company, user);
  return company;
};

const has = async (company: Company, user: User) => {
  return await adapterOwners.has(company, user);
};

export const serviceOwners = {
  getOwnerList: checkAuthOwnerWithCompany(getOwnerList),
  addOwnerToCompany: checkAuthOwnerWithCompany(addOwnerToCompany),
  removeOwnerFromCompany: checkAuthOwnerWithCompany(removeOwnerFromCompany),
  has: checkAuthOwnerWithCompany(has),
};
