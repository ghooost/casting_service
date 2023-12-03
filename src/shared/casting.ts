import type { Applicant } from "./applicant";
import type { Datetime, ID } from "./core";

export interface Casting {
  id: ID;
  title: string;
  roles: Set<CastingRole>;
  slots: Set<CastingSlot>;
  fields: Set<CastingField>;
}

export interface CastingRole {
  id: ID;
  title: string;
}

export interface CastingSlot {
  id: ID;
  numberOfApplicants: number;
  conditions: Set<CastingSlotCondition>;
  startAt: Datetime;
  endAt: Datetime;
  openAt: number;
  applicants: Set<Applicant>;
}

export interface CastingSlotCondition {
  id: ID;
  title: string;
  filterFn: (applicant: Applicant) => boolean;
}

const InputTypes = [
  "text",
  "sex",
  "number",
  "phone",
  "email",
  "file",
  "role",
] as const;

export interface CastingField {
  id: ID;
  title: string;
  inputType: (typeof InputTypes)[number];
  isRequired: boolean;
}
