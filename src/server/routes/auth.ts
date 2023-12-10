import express from "express";

import * as controllerAuth from "@controllers/auth";

export const routerAuth = express.Router();

routerAuth.post("/in", controllerAuth.signIn);
routerAuth.get("/out", controllerAuth.signOut);
routerAuth.get("/check", controllerAuth.checkSession);
