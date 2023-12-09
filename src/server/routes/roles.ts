import express from "express";

import * as controllerRoles from "@controllers/roles";

export const routerRoles = express.Router();
routerRoles.get("/", controllerRoles.roleList);
routerRoles.post("/", controllerRoles.roleCreate);
routerRoles.get("/:roleId", controllerRoles.roleGet);
routerRoles.put("/:roleId", controllerRoles.roleUpdate);
routerRoles.delete("/:roleId", controllerRoles.roleDelete);
