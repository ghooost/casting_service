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

const getSessionById = async (sessionId: Session["id"] | undefined) => {
  if (!sessionId) {
    return null;
  }
  const session = await adapterSessions.find(sessionId);
  if (!session || !isValidSession(session)) {
    return null;
  }
  return session;
};

const updateSession = async (session: Session) => {
  if (!session || !isValidSession(session)) {
    return null;
  }
  return await adapterSessions.update(session.id, {
    endTime: Date.now() + SESSION_EXPIRATION_MS,
  });
};

const createSession = async (userId: Session["userId"]) => {
  return await adapterSessions.add({
    userId,
    endTime: Date.now() + SESSION_EXPIRATION_MS,
  });
};

const deleteSession = async (session: Session) => {
  await adapterSessions.remove(session);
};

export const serviceSessions = {
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
};
