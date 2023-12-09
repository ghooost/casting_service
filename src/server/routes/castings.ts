import express from "express";

import { routerFields } from "./fields";
import { routerRoles } from "./roles";
import { routerSlots } from "./slots";

import * as controllerCastings from "@controllers/castings";

export const routerCastings = express.Router();
routerCastings.get("/", controllerCastings.listCastings);
routerCastings.post("/", controllerCastings.createCasting);
routerCastings.get("/:castingId", controllerCastings.getCasting);
routerCastings.put("/:castingId", controllerCastings.updateCasting);
routerCastings.delete("/:castingId", controllerCastings.deleteCasting);

routerCastings.use("/:castingId/role", routerRoles);
routerCastings.use("/:castingId/field", routerFields);
routerCastings.use("/:castingId/slot", routerSlots);
