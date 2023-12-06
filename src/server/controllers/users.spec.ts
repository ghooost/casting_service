import express from "express";
import { describe, expect, it, vi } from "vitest";

import { listUsers } from "./users";

import { adapterUsers } from "@db/users";
import { Context, RequestWithContext } from "@shared/context";
import { ForbiddenError } from "@shared/error";
import { User } from "@shared/user";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, false),
  };
});

const makeRequest = (
  params: Record<string, unknown>,
  body: Record<string, unknown>,
  context: Context
) => {
  return {
    body,
    context,
    params,
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

const users: User[] = [
  {
    id: 1,
    email: "test1@test.com",
    password: "*", // will be returned with masked password
    isAdmin: true,
  },
  {
    id: 2,
    email: "test2@test.com",
    password: "*",
    isAdmin: false,
  },
];

describe("controllers/users integration", () => {
  it("listUsers - for admin", async () => {
    await adapterUsers.setData(users);
    const request = makeRequest({}, {}, { author: users[0], session: null });
    const response = makeResponse();
    const next = vi.fn();
    await listUsers(request, response as unknown as express.Response, next);
    expect(response.status).toBeCalledWith(200);
    expect(response.send.mock.calls[0][0]).toMatchObject(users);
  });
  it("listUsers - for non-admin", async () => {
    await adapterUsers.setData(users);
    const request = makeRequest({}, {}, { author: users[1], session: null });
    const response = makeResponse();
    const next = vi.fn();
    await expect(
      async () =>
        await listUsers(request, response as unknown as express.Response, next)
    ).rejects.toThrowError(ForbiddenError);
  });
});
