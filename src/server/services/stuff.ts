import { adapterStuff } from "@db/companies";
import { Company } from "@shared/company";
import { User } from "@shared/user";
import { checkAuthOwnerWithCompany } from "@utils/auth";

const getStuffList = async (company: Company) => {
  return await adapterStuff.filter(company);
};

const getStuffById = async (company: Company, id: User["id"]) => {
  return await adapterStuff.find(company, id);
};

const addStuffToCompany = async (company: Company, user: User) => {
  await adapterStuff.link(company, user);
  return company;
};

const removeStuffFromCompany = async (company: Company, user: User) => {
  await adapterStuff.unlink(company, user);
  return company;
};

const has = async (company: Company, user: User) => {
  return await adapterStuff.has(company, user);
};

export const serviceStuff = {
  getStuffList: checkAuthOwnerWithCompany(getStuffList),
  getStuffById: checkAuthOwnerWithCompany(getStuffById),
  addStuffToCompany: checkAuthOwnerWithCompany(addStuffToCompany),
  removeStuffFromCompany: checkAuthOwnerWithCompany(removeStuffFromCompany),
  has: checkAuthOwnerWithCompany(has),
};
