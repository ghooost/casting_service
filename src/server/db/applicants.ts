import { makeApiForMap, makeChildArrayApiLinkable } from "./api";

import { Applicant } from "@shared/applicant";
import { CastingSlot } from "@shared/casting";

const collection = new Map<Applicant["id"], Applicant>();
const getDefaultApplicant = () => ({
  id: 0,
  data: {},
});

export const makeAdapterApplicants = (
  collection: Map<Applicant["id"], Applicant>,
  isLocked: boolean = true,
  initId: number = 0
) => makeApiForMap(collection, getDefaultApplicant, isLocked, initId);

export const adapterApplicants = makeAdapterApplicants(collection, true, 0);

export const adapterSlotApplicants = makeChildArrayApiLinkable(
  (slot: CastingSlot) => slot.applicants
);
