import express from "express";

import { Session } from "./session";
import { User } from "./user";

export interface Context {
  session: Session | null;
  author: User | null;
}

export interface RequestWithContext extends express.Request {
  context: Context;
}

export interface RequestWithPossibleContext extends express.Request {
  context?: Context;
}
