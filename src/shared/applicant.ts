import { ID } from "./core";

export interface Applicant {
  id: ID;
  data: Record<string, string | number>;
}
