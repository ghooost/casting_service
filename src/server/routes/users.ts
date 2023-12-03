import express from "express";

import * as controllerUsers from "@controllers/users";

export const routerUsers = express.Router();
routerUsers.get("/", controllerUsers.listUsers);
routerUsers.post("/", controllerUsers.createUser);
routerUsers.get("/:id", controllerUsers.getUser);
routerUsers.put("/:id", controllerUsers.updateUser);
routerUsers.delete("/:id", controllerUsers.deleteUser);
