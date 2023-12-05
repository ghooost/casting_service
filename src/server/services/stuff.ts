import { adapterStuff } from "@db/companies";
import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getStuffList = (company: Company) => {
  return adapterStuff.filter(company);
};

const addStuffToCompany = (company: Company, user: User) => {
  adapterStuff.link(company, user);
  return company;
};

const removeStuffFromCompany = (company: Company, user: User) => {
  adapterStuff.unlink(company, user);
  return company;
};

export const serviceStuff = {
  getStuffList: checkAuthOwnerWithCompany(getStuffList),
  addStuffToCompany: checkAuthOwnerWithCompany(addStuffToCompany),
  removeStuffFromCompany: checkAuthOwnerWithCompany(removeStuffFromCompany),
};
