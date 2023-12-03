import { uniqId } from "@db/index";
import { Applicant } from "@shared/applicant";
import { Casting, CastingSlotCondition, CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getSlotsList = (casting: Casting) => {
  return Array.from(casting.slots);
};

const getSlotById = (casting: Casting, slotId: CastingSlot["id"]) => {
  const slot = Array.from(casting.slots).find(({ id }) => id === slotId);
  if (!slot) {
    throw new NotFoundError();
  }
  return slot;
};

const createSlot = (
  casting: Casting,
  data: Omit<CastingSlot, "id" | "conditions" | "applicants">
) => {
  const slot: CastingSlot = {
    ...data,
    conditions: new Set<CastingSlotCondition>(),
    applicants: new Set<Applicant>(),
    id: uniqId(),
  };
  casting.slots.add(slot);
  return slot;
};

const updateSlot = (
  slot: CastingSlot,
  data: Omit<CastingSlot, "id" | "conditions" | "applicants">
) => {
  slot.numberOfApplicants = data.numberOfApplicants;
  slot.openAt = data.openAt;
  slot.startAt = data.startAt;
  slot.endAt = data.endAt;
  return slot;
};

const deleteSlot = (casting: Casting, slot: CastingSlot) => {
  casting.slots.delete(slot);
};

const reArrangeSlots = (casting: Casting, slotIds: CastingSlot["id"][]) => {
  const dict: [CastingSlot["id"], CastingSlot][] = Array.from(
    casting.slots
  ).map((data) => [data.id, data]);
  const slots = new Map<CastingSlot["id"], CastingSlot>(dict);
  const newSlots = new Set<CastingSlot>();
  for (const slotId of slotIds) {
    const slot = slots.get(slotId);
    if (slot) {
      newSlots.add(slot);
    }
  }
  casting.slots = newSlots;
};

export const serviceCompanies = {
  getSlotsList: checkAuthStuff(getSlotsList),
  getSlotById: checkAuthStuff(getSlotById),
  createSlot: checkAuthStuff(createSlot),
  updateSlot: checkAuthStuff(updateSlot),
  deleteSlot: checkAuthStuff(deleteSlot),
  reArrangeSlots: checkAuthStuff(reArrangeSlots),
};
