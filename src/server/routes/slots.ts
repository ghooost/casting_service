import express from "express";

import { routerApplicants } from "./applicants";

import * as controllerSlots from "@controllers/slots";

export const routerSlots = express.Router();
routerSlots.get("/", controllerSlots.slotList);
routerSlots.post("/", controllerSlots.slotCreate);
routerSlots.get("/:slotId", controllerSlots.slotGet);
routerSlots.put("/:slotId", controllerSlots.slotUpdate);
routerSlots.delete("/:slotId", controllerSlots.slotDelete);

routerSlots.use("/:slotId/applicants", routerApplicants);
