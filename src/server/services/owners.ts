import { adapterOwners } from "@db/companies";
import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getOwnerList = (company: Company) => {
  return adapterOwners.filter(company);
};

const addOwnerToCompany = (company: Company, user: User) => {
  adapterOwners.link(company, user);
  return company;
};

const removeOwnerFromCompany = (company: Company, user: User) => {
  adapterOwners.unlink(company, user);
  return company;
};

export const serviceOwner = {
  getOwnerList: checkAuthOwnerWithCompany(getOwnerList),
  addOwnerToCompany: checkAuthOwnerWithCompany(addOwnerToCompany),
  removeOwnerFromCompany: checkAuthOwnerWithCompany(removeOwnerFromCompany),
};
