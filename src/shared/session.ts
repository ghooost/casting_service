import { Datetime } from "./core";
import { User } from "./user";

type SessionID = string;

export interface Session {
  id: SessionID;
  userId: User["id"];
  endTime: Datetime;
}

export type MaybeSession = Session | null | undefined;
