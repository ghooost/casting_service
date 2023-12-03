import cors from "cors";
import express from "express";

import { authMiddleware } from "@middlewares/auth";
import { contextMiddleware } from "@middlewares/context";
import { errorMiddleware } from "@middlewares/error";
import { routerAuth } from "@routes/auth";
import { routerCompanies } from "@routes/companies";
import { routerUsers } from "@routes/users";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(contextMiddleware);
app.use(authMiddleware);
app.use("/auth", routerAuth);
app.use("/users", routerUsers);
app.use("/company", routerCompanies);
app.use(errorMiddleware);

app.listen(process.env.VITE_SERVER_PORT, () => {
  console.log(`Server at ${process.env.VITE_SERVER_PORT}`);
});
