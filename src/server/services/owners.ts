import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getOwnersList = (company: Company) => {
  return Array.from(company.owners);
};

const addOwnerToCompany = (company: Company, user: User) => {
  company.owners.add(user);
  return company;
};

const removeOwnerFromCompany = (company: Company, user: User) => {
  company.owners.delete(user);
  return company;
};

export const serviceOwners = {
  getOwnersList: checkAuthOwnerWithCompany(getOwnersList),
  addOwnerToCompany: checkAuthOwnerWithCompany(addOwnerToCompany),
  removeOwnerFromCompany: checkAuthOwnerWithCompany(removeOwnerFromCompany),
};
