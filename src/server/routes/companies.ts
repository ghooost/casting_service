import express from "express";

import * as controllerCompanies from "@controllers/companies";

export const routerCompanies = express.Router();
routerCompanies.get("/", controllerCompanies.listCompanies);
routerCompanies.post("/", controllerCompanies.createCompany);
routerCompanies.get("/:companyId", controllerCompanies.getCompany);
routerCompanies.put("/:companyId", controllerCompanies.updateCompany);
routerCompanies.delete("/:companyId", controllerCompanies.deleteCompany);

routerCompanies.get("/:companyId/owners", controllerCompanies.getCompany);
