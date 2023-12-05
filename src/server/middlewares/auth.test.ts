import express from "express";
import { describe, expect, it, vi } from "vitest";

import { authMiddleware } from "./auth";

const mocks = vi.hoisted(() => {
  return {
    updateSession: vi.fn(),
    getSessionById: vi.fn(),
    coreGetUserById: vi.fn(),
    selectContext: vi.fn(),
    nextFn: vi.fn(),
  };
});

vi.mock("@services/sessions", () => ({
  serviceSessions: {
    updateSession: mocks.updateSession,
    getSessionById: mocks.getSessionById,
  },
}));

vi.mock("@services/users", () => ({
  serviceUsers: {
    coreGetUserById: mocks.coreGetUserById,
  },
}));

vi.mock("@utils/context", () => ({
  selectContext: mocks.selectContext,
}));

describe("middleware/auth", () => {
  it("authMiddleware null session", () => {
    mocks.selectContext.mockReturnValue({
      session: null,
      user: null,
    });
    mocks.getSessionById.mockReturnValue(null);
    authMiddleware({} as express.Request, {} as express.Response, mocks.nextFn);
    expect(mocks.selectContext).toBeCalledTimes(1);
    expect(mocks.getSessionById).toBeCalledTimes(1);
    expect(mocks.nextFn).toBeCalledTimes(1);
    expect(mocks.updateSession).not.toBeCalled();
  });
  it("authMiddleware not null session", () => {
    const sessionObj = {};
    const userObj = {};
    const contextObj = {
      session: null,
      author: null,
    };
    mocks.selectContext.mockReturnValue(contextObj);
    mocks.getSessionById.mockReturnValue(sessionObj);
    mocks.coreGetUserById.mockReturnValue(userObj);
    authMiddleware({} as express.Request, {} as express.Response, mocks.nextFn);
    expect(mocks.updateSession).toBeCalledTimes(1);
    expect(mocks.nextFn).toBeCalledTimes(2);
    expect(contextObj.session).toBe(sessionObj);
    expect(contextObj.author).toBe(userObj);
  });
});
