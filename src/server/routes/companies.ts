import express from "express";

import { routerCastings } from "./castings";
import { routerOwners } from "./owners";
import { routerStuff } from "./stuff";

import * as controllerCompanies from "@controllers/companies";

export const routerCompanies = express.Router();
routerCompanies.get("/", controllerCompanies.listCompanies);
routerCompanies.post("/", controllerCompanies.createCompany);
routerCompanies.get("/:companyId", controllerCompanies.getCompany);
routerCompanies.put("/:companyId", controllerCompanies.updateCompany);
routerCompanies.delete("/:companyId", controllerCompanies.deleteCompany);

routerCompanies.use("/:companyId/casting", routerCastings);
routerCompanies.use("/:companyId/owner", routerOwners);
routerCompanies.use("/:companyId/stuff", routerStuff);
