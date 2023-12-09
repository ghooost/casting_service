import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createStuff, getStuff, listStuff, updateStuff } from "./stuff";

import { adapterCompanies } from "@db/companies";
import { adapterUsers } from "@db/users";
import { Company } from "@shared/company";
import { ForbiddenError } from "@shared/error";
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

vi.mock("@db/companies", async (importOriginal) => {
  const collection = new Map<Company["id"], Company>();
  const origin = await importOriginal<typeof import("@db/companies")>();
  return {
    ...origin,
    adapterCompanies: origin.makeAdapterCompanies(collection, false),
  };
});

const [mockDb, resetDb] = initMockDb({ adapterUsers, adapterCompanies });

beforeEach(async () => {
  await resetDb();
  vi.clearAllMocks();
});

const next = vi.fn();
const response = makeResponse();

describe("controllers/stuff", () => {
  describe("listStuff", () => {
    it("should return a list of stuff to admin", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
        },
        {},
        { author: mockDb.users[0], session: null }
      ) as unknown as Parameters<typeof listStuff>[0];

      await listStuff(request, response as unknown as express.Response, next);

      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        mockDb.companies[0].stuff.map(maskPrivateData)
      );
    });
    it("should return a list of stuff to owner", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
        },
        {},
        { author: mockDb.companies[0].owners[0], session: null }
      ) as unknown as Parameters<typeof listStuff>[0];

      await listStuff(request, response as unknown as express.Response, next);

      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        mockDb.companies[0].stuff.map(maskPrivateData)
      );
    });
    it("shouldn fail for stuff", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
        },
        {},
        { author: mockDb.companies[0].stuff[0], session: null }
      ) as unknown as Parameters<typeof listStuff>[0];

      await expect(
        async () =>
          await listStuff(
            request,
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ForbiddenError);
    });
    it("shouldn fail for non-company user", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
        },
        {},
        { author: null, session: null }
      ) as unknown as Parameters<typeof listStuff>[0];

      await expect(
        async () =>
          await listStuff(
            request,
            response as unknown as express.Response,
            next
          )
      ).rejects.toThrowError(ForbiddenError);
    });
  });

  describe("getStuff", () => {
    it("should return single stuff to owner", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
          stuffId: mockDb.companies[0].stuff[0].id,
        },
        {},
        { author: mockDb.users[1], session: null }
      ) as unknown as Parameters<typeof getStuff>[0];

      await getStuff(request, response as unknown as express.Response, next);

      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject(
        maskPrivateData(mockDb.companies[0].stuff[0])
      );
    });
    it("should fail for stuff", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
          stuffId: mockDb.companies[0].stuff[0].id,
        },
        {},
        { author: mockDb.users[2], session: null }
      ) as unknown as Parameters<typeof getStuff>[0];

      await expect(
        async () =>
          await getStuff(request, response as unknown as express.Response, next)
      ).rejects.toThrowError(ForbiddenError);
    });
  });

  describe("createStuff route", () => {
    it("should create a new stuff", async () => {
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
        },
        {
          email: "new@test.com",
          password: "2",
          isAdmin: false,
        },
        { author: mockDb.users[1], session: null }
      ) as unknown as Parameters<typeof getStuff>[0];

      await createStuff(request, response as unknown as express.Response, next);

      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject({
        email: "new@test.com",
        password: "*",
        isAdmin: false,
      });
    });
  });

  describe("updateStuff route", () => {
    it("should update an existing stuff", async () => {
      const savedUsers = await adapterUsers.filter();
      const request = makeRequest(
        {
          companyId: mockDb.companies[0].id,
          stuffId: mockDb.companies[0].stuff[0].id,
        },
        {
          email: "new@test.com",
          password: "2",
          isAdmin: false,
        },
        { author: mockDb.users[1], session: null }
      ) as unknown as Parameters<typeof getStuff>[0];

      await updateStuff(request, response as unknown as express.Response, next);

      expect(response.status).toBeCalledWith(200);
      expect(response.send.mock.calls[0][0]).toMatchObject({
        email: "new@test.com",
        password: "*",
        isAdmin: false,
      });
      const newUsers = await adapterUsers.filter();
      expect(newUsers.length).toBe(savedUsers.length);
    });
  });

  describe("deleteStuff route", () => {
    it("should delete an existing stuff", async () => {
      // Тест deleteStuff
    });
  });
});
