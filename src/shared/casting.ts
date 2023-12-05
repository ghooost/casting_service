import type { Applicant } from "./applicant";
import type { Datetime, ID } from "./core";

export interface Casting {
  id: ID;
  title: string;
  roles: CastingRole[];
  slots: CastingSlot[];
  fields: CastingField[];
}

export interface CastingRole {
  id: ID;
  title: string;
}

export interface CastingSlot {
  id: ID;
  numberOfApplicants: number;
  startAt: Datetime;
  endAt: Datetime;
  openAt: number;
  applicants: Applicant[];
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
