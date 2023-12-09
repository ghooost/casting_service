import cors from "cors";
import express from "express";

import { authMiddleware } from "@middlewares/auth";
import { contextMiddleware } from "@middlewares/context";
import { errorMiddleware } from "@middlewares/error";
import { routerAuth } from "@srvroutes/auth";
import { routerCompanies } from "@srvroutes/companies";
import { routerUsers } from "@srvroutes/users";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(contextMiddleware);
app.use(authMiddleware);
app.use("/auth", routerAuth);
app.use("/user", routerUsers);
app.use("/company", routerCompanies);
app.use(errorMiddleware);

app.listen(process.env.VITE_SERVER_PORT, () => {
  console.log(`Server at ${process.env.VITE_SERVER_PORT}`);
});
