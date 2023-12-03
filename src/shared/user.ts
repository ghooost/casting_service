import { ID } from "./core";

export interface User {
  id: ID;
  email: string;
  password: string;
  isAdmin: boolean;
}

export type MaybeUser = User | null | undefined;
