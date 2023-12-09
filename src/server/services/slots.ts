import { adapterSlots } from "@db/companies";
import { Casting, CastingSlot } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getSlotsList = async (casting: Casting) => {
  return await adapterSlots.filter(casting);
};

const getSlotById = async (casting: Casting, slotId: CastingSlot["id"]) => {
  const slot = await adapterSlots.find(casting, slotId);
  if (!slot) {
    throw new NotFoundError();
  }
  return slot;
};

const createSlot = async (
  casting: Casting,
  data: Omit<CastingSlot, "id" | "applicants">
) => {
  return await adapterSlots.add(casting, data);
};

const updateSlot = async (
  casting: Casting,
  slot: CastingSlot,
  data: Partial<Omit<CastingSlot, "id" | "applicants">>
) => {
  await adapterSlots.update(casting, slot.id, data);
  return slot;
};

const deleteSlot = async (casting: Casting, slot: CastingSlot) => {
  await adapterSlots.remove(casting, slot);
};

const reArrangeSlots = async (
  casting: Casting,
  slotIds: CastingSlot["id"][]
) => {
  await adapterSlots.reArrange(casting, slotIds);
};

export const serviceSlots = {
  getSlotsList: checkAuthStuff(getSlotsList),
  getSlotById: checkAuthStuff(getSlotById),
  createSlot: checkAuthStuff(createSlot),
  updateSlot: checkAuthStuff(updateSlot),
  deleteSlot: checkAuthStuff(deleteSlot),
  reArrangeSlots: checkAuthStuff(reArrangeSlots),
};
