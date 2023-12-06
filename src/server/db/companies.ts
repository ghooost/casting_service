import {
  makeApiForMap,
  makeChildArrayApiEditable,
  makeChildArrayApiLinkable,
} from "./api";

import { Applicant } from "@shared/applicant";
import {
  Casting,
  CastingField,
  CastingRole,
  CastingSlot,
} from "@shared/casting";
import { Company } from "@shared/company";

const collection = new Map<Company["id"], Company>();
const getDefaultItem = () => ({
  id: 0,
  title: "",
  owners: [],
  stuff: [],
  castings: [],
});

export const makeAdapterCompanies = (
  collection: Map<Company["id"], Company>,
  isLocked: boolean = true,
  initId: number = 0
) => makeApiForMap(collection, getDefaultItem, isLocked, initId);

export const adapterCompanies = makeAdapterCompanies(collection, true, 0);

export const adapterOwners = makeChildArrayApiLinkable(
  (company: Company) => company.owners
);

export const adapterStuff = makeChildArrayApiLinkable(
  (company: Company) => company.stuff
);

export const adapterCastings = makeChildArrayApiEditable(
  (company: Company) => company.castings,
  (): Casting => ({
    id: 0,
    title: "",
    fields: [],
    roles: [],
    slots: [],
  })
);

export const adapterFields = makeChildArrayApiEditable(
  (casting: Casting) => casting.fields,
  (): CastingField => ({
    id: 0,
    title: "",
    inputType: "text",
    isRequired: false,
  })
);

export const adapterRoles = makeChildArrayApiEditable(
  (casting: Casting) => casting.roles,
  (): CastingRole => ({
    id: 0,
    title: "",
  })
);

export const adapterSlots = makeChildArrayApiEditable(
  (casting: Casting) => casting.slots,
  (): CastingSlot => ({
    id: 0,
    numberOfApplicants: 0,
    startAt: 0,
    endAt: 0,
    openAt: 0,
    applicants: [],
  })
);

export const adapterApplicants = makeChildArrayApiEditable(
  (slot: CastingSlot) => slot.applicants,
  (): Applicant => ({
    id: 0,
    data: {},
  })
);
