import express from "express";

import * as controllerStuff from "@controllers/stuff";

export const routerStuff = express.Router();
routerStuff.get("/", controllerStuff.listStuff);
routerStuff.post("/", controllerStuff.createStuff);
routerStuff.get("/:stuffId", controllerStuff.getStuff);
routerStuff.put("/:stuffId", controllerStuff.updateStuff);
routerStuff.delete("/:stuffId", controllerStuff.deleteStuff);
