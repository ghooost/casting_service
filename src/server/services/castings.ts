import { adapterCastings } from "@db/companies";
import { checkAuthStuffWithCompany } from "@utils/auth";
import { Casting } from "src/shared/casting";
import { Company } from "src/shared/company";
import { NotFoundError } from "src/shared/error";

const getCastingList = async (company: Company) => {
  return await adapterCastings.filter(company);
};

const getCastingById = async (company: Company, castingId: Casting["id"]) => {
  const casting = await adapterCastings.find(company, castingId);
  if (!casting) {
    throw new NotFoundError();
  }
  return casting;
};

const createCasting = async (
  company: Company,
  data: Pick<Casting, "title">
) => {
  return await adapterCastings.add(company, data);
};

const updateCasting = async (
  company: Company,
  casting: Casting,
  data: Partial<Casting>
) => {
  return await adapterCastings.update(company, casting.id, data);
};

const deleteCasting = async (company: Company, casting: Casting) => {
  await adapterCastings.remove(company, casting);
};

export const serviceCastings = {
  getCastingList: checkAuthStuffWithCompany(getCastingList),
  getCastingById: checkAuthStuffWithCompany(getCastingById),
  createCasting: checkAuthStuffWithCompany(createCasting),
  updateCasting: checkAuthStuffWithCompany(updateCasting),
  deleteCasting: checkAuthStuffWithCompany(deleteCasting),
};
