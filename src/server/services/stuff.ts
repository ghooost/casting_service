import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getStuffList = (company: Company) => {
  return Array.from(company.stuff);
};

const addStuffToCompany = (company: Company, user: User) => {
  company.stuff.add(user);
  return company;
};

const removeStuffFromCompany = (company: Company, user: User) => {
  company.stuff.delete(user);
  return company;
};

export const serviceStuff = {
  getStuffList: checkAuthOwnerWithCompany(getStuffList),
  addStuffToCompany: checkAuthOwnerWithCompany(addStuffToCompany),
  removeStuffFromCompany: checkAuthOwnerWithCompany(removeStuffFromCompany),
};
