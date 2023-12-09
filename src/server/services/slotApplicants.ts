import { adapterApplicants, adapterSlotApplicants } from "@db/applicants";
import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";
import { checkAuthStuff } from "@utils/auth";

const getApplicantsList = async (slot: CastingSlot) => {
  return await adapterSlotApplicants.filter(slot);
};

const getApplicantById = async (slot: CastingSlot, id: Applicant["id"]) => {
  return await adapterSlotApplicants.find(slot, id);
};

const addApplicantToSlot = async (slot: CastingSlot, user: Applicant) => {
  await adapterSlotApplicants.link(slot, user);
  return slot;
};

const removeApplicantFromSlot = async (slot: CastingSlot, user: Applicant) => {
  await adapterSlotApplicants.unlink(slot, user);
  return slot;
};

const has = async (slot: CastingSlot, user: Applicant) => {
  return await adapterSlotApplicants.has(slot, user);
};

const createApplicant = async (data: Omit<Applicant, "id">) => {
  const applicant = await adapterApplicants.add(data);
  return applicant;
};

const updateApplicant = async (
  user: Applicant,
  data: Omit<Applicant, "id">
) => {
  const applicant = await adapterApplicants.update(user.id, data);
  return applicant;
};

export const serviceSlotApplicants = {
  getApplicantsList: checkAuthStuff(getApplicantsList),
  getApplicantById: checkAuthStuff(getApplicantById),
  addApplicantToSlot: checkAuthStuff(addApplicantToSlot),
  removeApplicantFromCompany: checkAuthStuff(removeApplicantFromSlot),
  has: checkAuthStuff(has),
  createApplicant: checkAuthStuff(createApplicant),
  updateApplicant: checkAuthStuff(updateApplicant),
};
