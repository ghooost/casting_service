import { Session } from "./session";
import { User } from "./user";

export interface SignInResponseBody {
  sessionId: Session["id"];
}

export interface SignInRequestBody {
  email: User["email"];
  password: User["password"];
}
