import {
  makeApiForMap,
  makeChildArrayApiWithAddRemove,
  makeChildArrayApiWithLinks,
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
export const adapterCompanies = makeApiForMap(
  collection,
  (): Company => ({
    id: 0,
    title: "",
    owners: [],
    stuff: [],
    castings: [],
  })
);

export const adapterOwners = makeChildArrayApiWithLinks(
  (company: Company) => company.owners
);

export const adapterStuff = makeChildArrayApiWithLinks(
  (company: Company) => company.stuff
);

export const adapterCastings = makeChildArrayApiWithAddRemove(
  (company: Company) => company.castings,
  (): Casting => ({
    id: 0,
    title: "",
    fields: [],
    roles: [],
    slots: [],
  })
);

export const adapterFields = makeChildArrayApiWithAddRemove(
  (casting: Casting) => casting.fields,
  (): CastingField => ({
    id: 0,
    title: "",
    inputType: "text",
    isRequired: false,
  })
);

export const adapterRoles = makeChildArrayApiWithAddRemove(
  (casting: Casting) => casting.roles,
  (): CastingRole => ({
    id: 0,
    title: "",
  })
);

export const adapterSlots = makeChildArrayApiWithAddRemove(
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

export const adapterApplicants = makeChildArrayApiWithAddRemove(
  (slot: CastingSlot) => slot.applicants,
  (): Applicant => ({
    id: 0,
    data: {},
  })
);
