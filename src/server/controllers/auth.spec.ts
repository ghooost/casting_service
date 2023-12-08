import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { signIn } from "./auth";

import { adapterSessions } from "@db/sessions";
import { adapterUsers } from "@db/users";
import { ForbiddenError } from "@shared/error";
import { Session } from "@shared/session";
import { User } from "@shared/user";
import { initMockDb, makeRequest, makeResponse } from "@utils/test";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, false),
  };
});

vi.mock("@db/sessions", async (importOriginal) => {
  const collection = new Map<Session["id"], Session>();
  const origin = await importOriginal<typeof import("@db/sessions")>();
  return {
    adapterSessions: origin.makeAdapterSessions(collection, false),
  };
});

const [mockDb, resetDb] = initMockDb({ adapterUsers, adapterSessions });
const response = makeResponse();
const next = vi.fn();

beforeEach(async () => {
  await resetDb();
  vi.clearAllMocks();
});

describe("controllers/auth integration", () => {
  describe("signId", () => {
    expect(adapterUsers.isLocked()).toBe(false);
    expect(adapterSessions.isLocked()).toBe(false);
    it("login into empty DB should add user to DB", async () => {
      await adapterUsers.setData([]);
      await adapterSessions.setData([]);
      const request = makeRequest(
        {},
        {
          email: "test@test.com",
          password: "1",
        },
        {
          author: null,
          session: null,
        }
      );

      await signIn(request, response as unknown as express.Response, next);
      expect(response.status).toBeCalledWith(200);
      expect(request.context.author).toMatchObject({
        email: "test@test.com",
        password: "1",
        isAdmin: true,
      });
      const users = await adapterUsers.filter(
        ({ email }) => email === "test@test.com"
      );
      expect(users.length).toBe(1);
      expect(request.context.session?.userId).toBe(users[0].id);
      expect(request.context.session?.id).toMatch(
        /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      );
      expect(request.context.session).toMatchObject({
        userId: users[0].id,
      });
      expect(await adapterUsers.filter()).toMatchObject([
        {
          email: "test@test.com",
          password: "1",
          isAdmin: true,
        },
      ]);
    });
    it("signIn with ok user", async () => {
      const request = makeRequest(
        {},
        {
          email: mockDb.users[0].email,
          password: mockDb.users[0].password,
        },
        {
          author: null,
          session: null,
        }
      );

      await signIn(request, response as unknown as express.Response, next);
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toHaveProperty("sessionId");
      expect(request.context.author).toMatchObject({
        email: mockDb.users[0].email,
        isAdmin: mockDb.users[0].isAdmin,
      });
      expect(request.context.session).toMatchObject({
        userId: mockDb.users[0].id,
      });
    });
    it("signIn with wrong user", async () => {
      const request = makeRequest(
        {},
        {
          email: "wrong@test.com",
          password: "2",
        },
        {
          author: null,
          session: null,
        }
      );

      const response = makeResponse();
      const next = vi.fn();

      await expect(
        async () =>
          await signIn(request, response as unknown as express.Response, next)
      ).rejects.toThrowError(ForbiddenError);
      expect(response.status).not.toBeCalled();
      expect(request.context.author).toBe(null);
    });
  });
});
