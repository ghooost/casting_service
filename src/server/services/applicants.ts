import { adapterApplicants } from "@db/companies";
import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getApplicantsList = (slot: CastingSlot) => {
  return adapterApplicants.filter(slot);
};

const getApplicantById = (slot: CastingSlot, applicantId: Applicant["id"]) => {
  const applicant = adapterApplicants.find(slot, applicantId);
  if (!applicant) {
    throw new NotFoundError();
  }
  return applicant;
};

const createApplicant = (slot: CastingSlot, data: Omit<Applicant, "id">) => {
  return adapterApplicants.add(slot, data);
};

const updateApplicant = (
  slot: CastingSlot,
  applicant: Applicant,
  data: Omit<Applicant, "id">
) => {
  return adapterApplicants.update(slot, applicant.id, data);
};

const deleteApplicant = (slot: CastingSlot, applicant: Applicant) => {
  adapterApplicants.remove(slot, applicant);
};

export const serviceCompanies = {
  getApplicantsList: checkAuthStuff(getApplicantsList),
  getApplicantById: checkAuthStuff(getApplicantById),
  createApplicant: checkAuthStuff(createApplicant),
  updateApplicant: checkAuthStuff(updateApplicant),
  deleteApplicant: checkAuthStuff(deleteApplicant),
};
