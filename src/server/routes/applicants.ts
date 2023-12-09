import express from "express";

import * as controllerApplicants from "@controllers/applicants";

export const routerApplicants = express.Router();
routerApplicants.get("/", controllerApplicants.applicantList);
routerApplicants.post("/", controllerApplicants.applicantCreate);
routerApplicants.get("/:applicantId", controllerApplicants.applicantGet);
routerApplicants.put("/:applicantId", controllerApplicants.applicantUpdate);
routerApplicants.delete("/:applicantId", controllerApplicants.applicantDelete);
