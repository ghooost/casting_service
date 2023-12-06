import { adapterApplicants } from "@db/companies";
import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getApplicantsList = async (slot: CastingSlot) => {
  return await adapterApplicants.filter(slot);
};

const getApplicantById = async (
  slot: CastingSlot,
  applicantId: Applicant["id"]
) => {
  const applicant = await adapterApplicants.find(slot, applicantId);
  if (!applicant) {
    throw new NotFoundError();
  }
  return applicant;
};

const createApplicant = async (
  slot: CastingSlot,
  data: Omit<Applicant, "id">
) => {
  return await adapterApplicants.add(slot, data);
};

const updateApplicant = async (
  slot: CastingSlot,
  applicant: Applicant,
  data: Omit<Applicant, "id">
) => {
  return await adapterApplicants.update(slot, applicant.id, data);
};

const deleteApplicant = async (slot: CastingSlot, applicant: Applicant) => {
  await adapterApplicants.remove(slot, applicant);
};

export const serviceCompanies = {
  getApplicantsList: checkAuthStuff(getApplicantsList),
  getApplicantById: checkAuthStuff(getApplicantById),
  createApplicant: checkAuthStuff(createApplicant),
  updateApplicant: checkAuthStuff(updateApplicant),
  deleteApplicant: checkAuthStuff(deleteApplicant),
};
