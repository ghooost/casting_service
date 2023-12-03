import { uniqId } from "@db/index";
import { checkAuthStuffWithCompany } from "@utils/auth";
import { Casting } from "src/shared/casting";
import { Company } from "src/shared/company";
import { NotFoundError } from "src/shared/error";

const getCastingList = (company: Company) => {
  return Array.from(company.castings);
};

const getCastingById = (company: Company, castingId: Casting["id"]) => {
  const casting = Array.from(company.castings).find(
    ({ id }) => id === castingId
  );
  if (!casting) {
    throw new NotFoundError();
  }
  return casting;
};

const createCasting = (company: Company, data: Pick<Casting, "title">) => {
  const casting: Casting = {
    id: uniqId(),
    title: data.title,
    roles: new Set(),
    slots: new Set(),
    fields: new Set(),
  };
  company.castings.add(casting);
  return casting;
};

const updateCasting = (
  _: Company,
  casting: Casting,
  data: Pick<Casting, "title">
) => {
  casting.title = data.title;
  return casting;
};

const deleteCasting = (company: Company, casting: Casting) => {
  company.castings.delete(casting);
};

export const serviceCompanies = {
  getCastingList: checkAuthStuffWithCompany(getCastingList),
  getCastingById: checkAuthStuffWithCompany(getCastingById),
  createCasting: checkAuthStuffWithCompany(createCasting),
  updateCasting: checkAuthStuffWithCompany(updateCasting),
  deleteCasting: checkAuthStuffWithCompany(deleteCasting),
};
