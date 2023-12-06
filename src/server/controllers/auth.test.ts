import express from "express";
import { describe, expect, it, vi } from "vitest";

import { signIn } from "./auth";

import { adapterSessions } from "@db/sessions";
import { adapterUsers } from "@db/users";
import { Context, RequestWithContext } from "@shared/context";
import { ForbiddenError } from "@shared/error";
import { Session } from "@shared/session";
import { User } from "@shared/user";

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

const makeRequest = (body: Record<string, unknown>, context: Context) => {
  return {
    body,
    context,
  } as unknown as RequestWithContext;
};

const makeResponse = () => {
  const statusFn = vi.fn();
  const sendFn = vi.fn();
  const response = {
    status: statusFn,
    send: sendFn,
  };
  statusFn.mockReturnValue(response);
  sendFn.mockReturnValue(response);
  return response;
};

describe("controllers/auth", () => {
  it("check collections", () => {
    expect(adapterUsers.isLocked()).toBe(false);
    expect(adapterSessions.isLocked()).toBe(false);
  });
  it("signIn integration - empty DB", async () => {
    await adapterUsers.setData([]);
    await adapterSessions.setData([]);
    const request = makeRequest(
      {
        email: "test@test.com",
        password: "1",
      },
      {
        author: null,
        session: null,
      }
    );

    const response = makeResponse();
    const next = vi.fn();

    try {
      await signIn(request, response as unknown as express.Response, next);
    } catch (e) {
      throw new Error();
    }
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
  it("signIn integration - ok user", async () => {
    await adapterUsers.setData([
      {
        id: 1,
        email: "test@test.com",
        password: "1",
        isAdmin: true,
      },
    ]);
    await adapterSessions.setData([]);
    const request = makeRequest(
      {
        email: "test@test.com",
        password: "1",
      },
      {
        author: null,
        session: null,
      }
    );

    const response = makeResponse();
    const next = vi.fn();

    try {
      await signIn(request, response as unknown as express.Response, next);
    } catch (e) {
      console.error(e);
    }
    expect(response.status).toBeCalledWith(200);
    expect(response.send.mock.calls[0][0]).toHaveProperty("sessionId");
    expect(request.context.author).toMatchObject({
      email: "test@test.com",
      password: "1",
      isAdmin: true,
    });
    const users = await adapterUsers.filter(
      ({ email }) => email === "test@test.com"
    );
    expect(users.length).toBe(1);
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
  it("signIn integration - wrong user", async () => {
    await adapterUsers.setData([
      {
        id: 1,
        email: "test@test.com",
        password: "1",
        isAdmin: true,
      },
    ]);
    await adapterSessions.setData([]);
    const request = makeRequest(
      {
        email: "test@test.com",
        password: "2",
      },
      {
        author: null,
        session: null,
      }
    );

    const response = makeResponse();
    const next = vi.fn();

    try {
      await signIn(request, response as unknown as express.Response, next);
      expect(false, "signIn should throw forbidden error").toBe(true);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError);
    }
    expect(response.status).not.toBeCalled();
    expect(request.context.author).toBe(null);
  });
});
