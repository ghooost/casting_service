import { beforeEach, describe, expect, it, vi } from "vitest";

import { serviceUsers } from "./users";

import { adapterUsers } from "@db/users";
import { ForbiddenError } from "@shared/error";
import { User } from "@shared/user";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, false),
  };
});

const user1: User = {
  id: 1,
  email: "test1@test.com",
  password: "1",
  isAdmin: false,
};
const user2: User = {
  id: 2,
  email: "test2@test.com",
  password: "2",
  isAdmin: false,
};
const user3: User = {
  id: 3,
  email: "test3@test.com",
  password: "3",
  isAdmin: false,
};
const admin: User = {
  id: 4,
  email: "admin@test.com",
  password: "4",
  isAdmin: true,
};

describe("services/users", () => {
  beforeEach(async () => {
    await adapterUsers.setData([]);
  });
  it("coreGetUserById", async () => {
    await adapterUsers.setData([user1, user2, user3]);
    expect(await serviceUsers.coreGetUserById(1)).toBe(user1);
    expect(await serviceUsers.coreGetUserById(2)).toBe(user2);
    expect(await serviceUsers.coreGetUserById(10)).toBe(null);
  });
  it("coreGetUserByEmail", async () => {
    await adapterUsers.setData([user1, user2, user3]);
    expect(await serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    expect(await serviceUsers.coreGetUserByEmail(user2.email)).toBe(user2);
    expect(await serviceUsers.coreGetUserByEmail("test@test.com")).toBe(null);
  });
  it("coreCreateInitialUserIfNoUsersAtAll", async () => {
    await adapterUsers.setData([user1, user2, user3]);
    await serviceUsers.coreCreateInitialUserIfNoUsersAtAll(
      "test@test.com",
      "10"
    );
    expect(await serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    expect(await serviceUsers.coreGetUserByEmail(user2.email)).toBe(user2);
    expect(await serviceUsers.coreGetUserByEmail("test@test.com")).toBe(null);
    await adapterUsers.setData([]);
    await serviceUsers.coreCreateInitialUserIfNoUsersAtAll(
      "test@test.com",
      "10"
    );
    expect(await serviceUsers.coreGetUserByEmail(user1.email)).toBe(null);
    expect(
      await serviceUsers.coreGetUserByEmail("test@test.com")
    ).toMatchObject({
      email: "test@test.com",
      password: "10",
    });
  });
  it("getUserList", async () => {
    await adapterUsers.setData([user1, user2, user3]);
    try {
      await serviceUsers.getUserList(user1);
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError);
    }
    expect(await serviceUsers.getUserList(admin)).toMatchObject([
      user1,
      user2,
      user3,
    ]);
  });
  it("createUser", async () => {
    await adapterUsers.setData([user1, user2]);
    try {
      await serviceUsers.createUser(user1, user3);
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(true, "should throw error").toBe(true);
    }
    await serviceUsers.createUser(admin, user3);
    expect(await serviceUsers.coreGetUserByEmail(user3.email)).toMatchObject({
      email: user3.email,
    });
    try {
      await serviceUsers.createUser(admin, { ...user3, email: "wrong email" });
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(true, "should throw error").toBe(true);
    }
  });
  it("deleteUser", async () => {
    await adapterUsers.setData([user1, user2]);
    try {
      await serviceUsers.deleteUser(user1, user3);
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(true, "should throw error").toBe(true);
    }
    await serviceUsers.deleteUser(admin, user3);
    expect(await serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    await serviceUsers.deleteUser(admin, user1);
    expect(await serviceUsers.coreGetUserByEmail(user1.email)).toBe(null);
  });
  it("getUserById", async () => {
    await adapterUsers.setData([user1, user2]);
    expect(await serviceUsers.getUserById(user1, user1.id)).toMatchObject({
      ...user1,
    });
    expect(await serviceUsers.getUserById(admin, user2.id)).toMatchObject({
      ...user2,
    });
    try {
      await serviceUsers.getUserById(user1, user2.id);
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(true, "should throw error").toBe(true);
    }
  });

  it("updateUser", async () => {
    await adapterUsers.setData([user1, user2]);
    //can update myself
    await serviceUsers.updateUser(user1, user1, {
      email: "1@test.com",
      isAdmin: true,
    });
    //but can't provide admin's privileges
    expect(await serviceUsers.getUserById(admin, user1.id)).toMatchObject({
      email: "1@test.com",
      isAdmin: false,
    });
    await serviceUsers.updateUser(admin, user1, {
      email: "2@test.com",
      isAdmin: true,
    });
    //admin can provide admin's privileges
    expect(await serviceUsers.getUserById(admin, user1.id)).toMatchObject({
      email: "2@test.com",
      isAdmin: true,
    });
    // but nobody can set non-uniq email
    try {
      await serviceUsers.updateUser(admin, user1, {
        email: user2.email,
      });
      expect(false, "should throw error").toBe(true);
    } catch (e) {
      expect(true, "should throw error").toBe(true);
    }
  });
});
