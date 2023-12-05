import { adapterCastings } from "@db/companies";
import { checkAuthStuffWithCompany } from "@utils/auth";
import { Casting } from "src/shared/casting";
import { Company } from "src/shared/company";
import { NotFoundError } from "src/shared/error";

const getCastingList = (company: Company) => {
  return adapterCastings.filter(company);
};

const getCastingById = (company: Company, castingId: Casting["id"]) => {
  const casting = adapterCastings.find(company, castingId);
  if (!casting) {
    throw new NotFoundError();
  }
  return casting;
};

const createCasting = (company: Company, data: Pick<Casting, "title">) => {
  return adapterCastings.add(company, data);
};

const updateCasting = (
  company: Company,
  casting: Casting,
  data: Partial<Casting>
) => {
  return adapterCastings.update(company, casting.id, data);
};

const deleteCasting = (company: Company, casting: Casting) => {
  adapterCastings.remove(company, casting);
};

export const serviceCastings = {
  getCastingList: checkAuthStuffWithCompany(getCastingList),
  getCastingById: checkAuthStuffWithCompany(getCastingById),
  createCasting: checkAuthStuffWithCompany(createCasting),
  updateCasting: checkAuthStuffWithCompany(updateCasting),
  deleteCasting: checkAuthStuffWithCompany(deleteCasting),
};
