import { beforeEach, describe, expect, it, vi } from "vitest";

import { serviceUsers } from "./users";

import { adapterCompanies } from "@db/companies";
import { adapterUsers } from "@db/users";
import { Company } from "@shared/company";
import { NotFoundError } from "@shared/error";
import { User } from "@shared/user";
import { initMockDb } from "@utils/test";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, false),
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

describe.only("services/users", () => {
  beforeEach(async () => {
    await resetDb();
    vi.resetAllMocks();
  });
  it("coreGetUserById", async () => {
    expect(await serviceUsers.coreGetUserById(1)).toBe(mockDb.users[0]);
    expect(await serviceUsers.coreGetUserById(2)).toBe(mockDb.users[1]);
    expect(await serviceUsers.coreGetUserById(10)).toBe(null);
  });
  it("coreGetUserByEmail", async () => {
    expect(await serviceUsers.coreGetUserByEmail(mockDb.users[0].email)).toBe(
      mockDb.users[0]
    );
    expect(await serviceUsers.coreGetUserByEmail(mockDb.users[1].email)).toBe(
      mockDb.users[1]
    );
    expect(await serviceUsers.coreGetUserByEmail("nobody@test.com")).toBe(null);
  });
  it("coreCreateInitialUserIfNoUsersAtAll", async () => {
    await adapterUsers.setData([]);
    await serviceUsers.coreCreateInitialUserIfNoUsersAtAll(
      "new@test.com",
      "10"
    );
    expect(await serviceUsers.coreGetUserByEmail("new@test.com")).toMatchObject(
      {
        email: "new@test.com",
        password: "10",
      }
    );
  });
  it("getUserList", async () => {
    expect(await serviceUsers.getUserList(mockDb.users[0])).toMatchObject(
      mockDb.users
    );
  });
  it("createUser", async () => {
    expect(
      await serviceUsers.createUser(mockDb.users[0], {
        email: "new@test.com",
        password: "1",
        isAdmin: true,
      })
    ).toMatchObject({ email: "new@test.com", password: "1", isAdmin: true });
  });
  it("deleteUser", async () => {
    await serviceUsers.deleteUser(mockDb.users[0], mockDb.users[1]);
    await expect(
      async () =>
        await serviceUsers.getUserById(mockDb.users[0], mockDb.users[1].id)
    ).rejects.toThrowError(NotFoundError);
  });
  it("getUserById", async () => {
    expect(
      await serviceUsers.getUserById(mockDb.users[0], mockDb.users[1].id)
    ).toMatchObject(mockDb.users[1]);
  });

  it.only("updateUser", async () => {
    expect(
      await serviceUsers.updateUser(mockDb.users[0], mockDb.users[1], {
        email: "new@test.com",
      })
    ).toMatchObject({ email: "new@test.com" });
  });

  it.only("updateSelfUser", async () => {
    expect(
      await serviceUsers.updateSelfUser(mockDb.users[2], mockDb.users[2], {
        email: "new@test.com",
      })
    ).toMatchObject({ email: "new@test.com" });
  });
});
