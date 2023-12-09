import { serviceCastings } from "@services/castings";
import { serviceCompanies } from "@services/companies";
import { serviceSlots } from "@services/slots";
import { Casting } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError } from "@shared/error";
import { MaybeUser } from "@shared/user";

export const getCompanyByParam = async (author: MaybeUser, param: string) => {
  const companyId = parseInt(param);
  if (!companyId) {
    throw new NotFoundError();
  }
  const company = await serviceCompanies.getCompanyById(author, companyId);
  if (!company) {
    throw new NotFoundError();
  }
  return company;
};

export const getCastingByParam = async (
  author: MaybeUser,
  company: Company,
  param: string
) => {
  const castingId = parseInt(param);
  if (!castingId) {
    throw new NotFoundError();
  }
  const casting = await serviceCastings.getCastingById(
    author,
    company,
    castingId
  );
  if (!casting) {
    throw new NotFoundError();
  }
  return casting;
};

export const getSlotByParam = async (
  author: MaybeUser,
  company: Company,
  casting: Casting,
  param: string
) => {
  const slotId = parseInt(param);
  if (!slotId) {
    throw new NotFoundError();
  }
  const slot = await serviceSlots.getSlotById(author, company, casting, slotId);
  if (!slot) {
    throw new NotFoundError();
  }
  return slot;
};
