import { User } from "@shared/user";

export const maskPrivateData = (user: User) => ({ ...user, password: "*" });
