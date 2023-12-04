import { uniqId } from "@db/index";
import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getApplicantsList = (slot: CastingSlot) => {
  return Array.from(slot.applicants);
};

const getApplicantById = (slot: CastingSlot, applicantId: Applicant["id"]) => {
  const applicant = Array.from(slot.applicants).find(
    ({ id }) => id === applicantId
  );
  if (!applicant) {
    throw new NotFoundError();
  }
  return applicant;
};

const createApplicant = (slot: CastingSlot, data: Omit<Applicant, "id">) => {
  const applicant: Applicant = {
    ...data,
    id: uniqId(),
  };
  slot.applicants.add(applicant);
  return applicant;
};

const updateApplicant = (applicant: Applicant, data: Omit<Applicant, "id">) => {
  //TODO: apply chenges
  return data;
};

const deleteApplicant = (slot: CastingSlot, applicant: Applicant) => {
  slot.applicants.delete(applicant);
};

export const serviceCompanies = {
  getApplicantsList: checkAuthStuff(getApplicantsList),
  getApplicantById: checkAuthStuff(getApplicantById),
  createApplicant: checkAuthStuff(createApplicant),
  updateApplicant: checkAuthStuff(updateApplicant),
  deleteApplicant: checkAuthStuff(deleteApplicant),
};
