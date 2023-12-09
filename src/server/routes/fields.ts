import express from "express";

import * as controllerFields from "@controllers/fields";

export const routerFields = express.Router();
routerFields.get("/", controllerFields.fieldList);
routerFields.post("/", controllerFields.fieldCreate);
routerFields.get("/:fieldId", controllerFields.fieldGet);
routerFields.put("/:fieldId", controllerFields.fieldUpdate);
routerFields.delete("/:fieldId", controllerFields.fieldDelete);
