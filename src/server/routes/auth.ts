import express from "express";

import * as controllerAuth from "@controllers/auth";

export const routerAuth = express.Router();

routerAuth.get("/signin", controllerAuth.signIn);
routerAuth.get("/signout", controllerAuth.signOut);
