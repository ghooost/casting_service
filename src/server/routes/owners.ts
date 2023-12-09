import express from "express";

import * as controllerOwners from "@controllers/owners";

export const routerOwners = express.Router();
routerOwners.get("/", controllerOwners.listOwners);
routerOwners.post("/", controllerOwners.createOwner);
routerOwners.get("/:castingId", controllerOwners.getOwner);
routerOwners.put("/:castingId", controllerOwners.updateOwner);
routerOwners.delete("/:castingId", controllerOwners.deleteOwner);
