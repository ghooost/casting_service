import express from "express";

import * as controllerAuth from "@controllers/auth";

export const routerAuth = express.Router();

routerAuth.post("/signin", controllerAuth.signIn);
routerAuth.get("/signout", controllerAuth.signOut);
