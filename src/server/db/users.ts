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
  isLocked: boolean = true,
  initId: number = 0
) => makeApiForMap(collection, getDefaultUser, isLocked, initId);

// standart adapter for user DB
export const adapterUsers = makeAdapterUsers(collection);
