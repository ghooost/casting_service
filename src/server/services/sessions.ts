import { adapterSessions } from "@db/sessions";
import { MaybeSession, Session } from "@shared/session";

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
  const session = adapterSessions.find(sessionId);
  if (!session || !isValidSession(session)) {
    return null;
  }
  return session;
};

const updateSession = (session: Session) => {
  if (!session || !isValidSession(session)) {
    return null;
  }
  return adapterSessions.update(session.id, {
    endTime: Date.now() + SESSION_EXPIRATION_MS,
  });
};

const createSession = (userId: Session["userId"]) => {
  return adapterSessions.add({
    userId,
    endTime: Date.now() + SESSION_EXPIRATION_MS,
  });
};

const deleteSession = (session: Session) => {
  adapterSessions.remove(session);
};

export const serviceSessions = {
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
};
