import { makeApiForMap } from "./api";

import { User } from "@shared/user";

const collection = new Map<User["id"], User>();
export const adapterUsers = makeApiForMap(
  collection,
  (): User => ({
    id: 0,
    email: "",
    password: "",
    isAdmin: false,
  })
);
