import { adapterSlots } from "@db/companies";
import { Casting, CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getSlotsList = (casting: Casting) => {
  return adapterSlots.filter(casting);
};

const getSlotById = (casting: Casting, slotId: CastingSlot["id"]) => {
  const slot = adapterSlots.find(casting, slotId);
  if (!slot) {
    throw new NotFoundError();
  }
  return slot;
};

const createSlot = (
  casting: Casting,
  data: Omit<CastingSlot, "id" | "applicants">
) => {
  return adapterSlots.add(casting, data);
};

const updateSlot = (
  casting: Casting,
  slot: CastingSlot,
  data: Partial<Omit<CastingSlot, "id" | "applicants">>
) => {
  adapterSlots.update(casting, slot.id, data);
  return slot;
};

const deleteSlot = (casting: Casting, slot: CastingSlot) => {
  adapterSlots.remove(casting, slot);
};

const reArrangeSlots = (casting: Casting, slotIds: CastingSlot["id"][]) => {
  adapterSlots.reArrange(casting, slotIds);
};

export const serviceCompanies = {
  getSlotsList: checkAuthStuff(getSlotsList),
  getSlotById: checkAuthStuff(getSlotById),
  createSlot: checkAuthStuff(createSlot),
  updateSlot: checkAuthStuff(updateSlot),
  deleteSlot: checkAuthStuff(deleteSlot),
  reArrangeSlots: checkAuthStuff(reArrangeSlots),
};
