import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "./users";

import { adapterUsers } from "@db/users";
import { ForbiddenError, NotFoundError, ParamsError } from "@shared/error";
import { defaultOkResponse } from "@shared/express";
import { User } from "@shared/user";
import { initMockDb, makeRequest, makeResponse } from "@utils/test";
import { maskPrivateData } from "@utils/users";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, false, 2),
  };
});

const next = vi.fn();
const response = makeResponse();
const [mockDb, resetDb] = initMockDb({ adapterUsers });

describe("controllers/users integration", async () => {
  beforeEach(async () => {
    await resetDb();
    vi.clearAllMocks();
  });

  describe("listUsers", () => {
    it("should work for admin and valid user id", async () => {
      const request = makeRequest(
        {},
        {},
        { author: mockDb.users[0], session: null }
      );
      await listUsers(request, response as unknown as express.Response, next);
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        mockDb.users.map(maskPrivateData)
      );
    });
    it("should fail for non-admin", async () => {
      const request = makeRequest(
        {},
        {},
        { author: mockDb.users[1], session: null }
      );
      await expect(
        async () =>
          await listUsers(
            request,
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ForbiddenError);
    });
  });
  describe("getUser", async () => {
    it("should work for admin and valid user id", async () => {
      const request = makeRequest(
        { userId: `${mockDb.users[1].id}` },
        {},
        { author: mockDb.users[0], session: null }
      );
      await getUser(
        request as unknown as Parameters<typeof getUser>[0],
        response as unknown as express.Response,
        next
      );
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        maskPrivateData(mockDb.users[1])
      );
    });
    it("should fail for admin and wrong user id", async () => {
      const request = makeRequest(
        { userId: `100` },
        {},
        { author: mockDb.users[0], session: null }
      );
      await expect(
        async () =>
          await getUser(
            request as unknown as Parameters<typeof getUser>[0],
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(NotFoundError);
    });
    it("should fail for non-admin", async () => {
      const request = makeRequest(
        { userId: mockDb.users[1].id },
        {},
        { author: mockDb.users[2], session: null }
      );
      await expect(
        async () =>
          await getUser(
            request as unknown as Parameters<typeof getUser>[0],
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ForbiddenError);
    });
  });

  describe("createUser", () => {
    it("should work for admin", async () => {
      const request = makeRequest(
        {},
        {
          email: "new@test.com",
          password: "2",
          isAdmin: false,
        },
        { author: mockDb.users[0], session: null }
      );
      await createUser(
        request as unknown as Parameters<typeof createUser>[0],
        response as unknown as express.Response,
        next
      );
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject({
        email: "new@test.com",
        password: "*",
        isAdmin: false,
      });
    });
    it("should fail for duplicate email", async () => {
      const request = makeRequest(
        {},
        {
          email: mockDb.users[1].email,
          password: "2",
          isAdmin: false,
        },
        { author: mockDb.users[0], session: null }
      );
      await expect(
        async () =>
          await createUser(
            request as unknown as Parameters<typeof getUser>[0],
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ParamsError);
    });
  });
  describe("updateUser", () => {
    it("should work for admin", async () => {
      const request = makeRequest(
        {
          userId: mockDb.users[2].id,
        },
        { email: "new@test.com" },
        { author: mockDb.users[0], session: null }
      );
      await updateUser(
        request as unknown as Parameters<typeof getUser>[0],
        response as unknown as express.Response,
        next
      );
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        maskPrivateData({ ...mockDb.users[2], email: "new@test.com" })
      );
    });
    it("should fail for duplicate email", async () => {
      const request = makeRequest(
        {
          userId: mockDb.users[2].id,
        },
        { email: mockDb.users[1].email },
        { author: mockDb.users[0], session: null }
      );
      await expect(
        async () =>
          await updateUser(
            request as unknown as Parameters<typeof getUser>[0],
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ParamsError);
    });
  });
  describe("deleteUser", () => {
    it("admin can delete everybody", async () => {
      const request = makeRequest(
        {
          userId: mockDb.users[2].id,
        },
        {},
        { author: mockDb.users[0], session: null }
      );
      await deleteUser(
        request as unknown as Parameters<typeof deleteUser>[0],
        response as unknown as express.Response,
        next
      );
      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(defaultOkResponse);
    });
  });
});
