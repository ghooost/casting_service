import { makeApiForMap } from "./api";

import { User } from "@shared/user";

const collection = new Map<User["id"], User>();
const getDefaultUser = () => ({
  id: 0,
  email: "",
  password: "",
  isAdmin: false,
});

// create an adapter for user DB
// create your own mock DB for tests
export const makeAdapterUsers = (
  collection: Map<User["id"], User>,
  initId: number = 0,
  isLocked: boolean = true
) => makeApiForMap(collection, getDefaultUser, initId, isLocked);

// standart adapter for user DB
export const adapterUsers = makeAdapterUsers(collection);
