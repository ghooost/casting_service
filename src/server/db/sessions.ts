import { makeApiForMap } from "./api";

import { Session } from "@shared/session";

const collection = new Map<Session["id"], Session>();
export const adapterSessions = makeApiForMap(
  collection,
  (): Session => ({
    id: "",
    userId: 0,
    endTime: 0,
  })
);
