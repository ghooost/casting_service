import { v4 as uuidv4 } from "uuid";

import { makeApiForMap } from "./api";

import { Session } from "@shared/session";

const collection = new Map<Session["id"], Session>();
const getDefaultItem = () => ({
  id: "",
  userId: 0,
  endTime: 0,
});
const generateId = () => uuidv4();

export const makeAdapterSessions = (
  collection: Map<Session["id"], Session>,
  isLocked: boolean = true,
  initId: () => string = generateId
) => makeApiForMap(collection, getDefaultItem, isLocked, initId);

export const adapterSessions = makeAdapterSessions(collection);
