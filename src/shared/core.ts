export type Datetime = number;
export type ID = number;
export const SexAvailable = ["male", "female", "other"] as const;
export type Sex = (typeof SexAvailable)[number];
