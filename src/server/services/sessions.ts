import { v4 as uuidv4 } from "uuid";

import { selectCollection } from "@db/index";
import { MaybeSession, Session } from "src/shared/session";

const SESSION_EXPIRATION_MS = 100000;

const isValidSession = (session: MaybeSession) => {
  if (!session) {
    return false;
  }
  const time = Date.now();
  if (session.endTime < time) {
    return false;
  }
  return true;
};

const getSessionById = (sessionId: Session["id"] | undefined) => {
  if (!sessionId) {
    return null;
  }
  const sessionsCollection = selectCollection("sessions");
  const session = sessionsCollection.get(sessionId);
  if (!session || !isValidSession(session)) {
    return null;
  }
  return session;
};

const updateSession = (session: Session) => {
  if (!session || !isValidSession(session)) {
    return null;
  }
  session.endTime = Date.now() + SESSION_EXPIRATION_MS;
  return session;
};

const createSession = (userId: Session["userId"]) => {
  const session = {
    id: uuidv4(),
    userId,
    endTime: Date.now() + SESSION_EXPIRATION_MS,
  };
  const sessionsCollection = selectCollection("sessions");
  sessionsCollection.set(session.id, session);
  return session;
};

const deleteSession = (session: Session) => {
  const sessionsCollection = selectCollection("sessions");
  sessionsCollection.delete(session.id);
};

export const serviceSessions = {
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
};
