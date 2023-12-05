import { Casting } from "./casting";
import { ID } from "./core";
import { User } from "./user";

export interface Company {
  id: ID;
  title: string;
  owners: User[];
  stuff: User[];
  castings: Casting[];
}

export type CompanyMinData = Pick<Company, "id" | "title">;

export type MaybeCompany = Company | null | undefined;
