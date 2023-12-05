import { beforeEach, describe, expect, it, vi } from "vitest";

import { serviceUsers } from "./users";

import { adapterUsers } from "@db/users";
import { User } from "@shared/user";

vi.mock("@db/users", async (importOriginal) => {
  const collection = new Map<User["id"], User>();
  const origin = await importOriginal<typeof import("@db/users")>();
  return {
    adapterUsers: origin.makeAdapterUsers(collection, 0, false),
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
  beforeEach(() => {
    adapterUsers.setData([]);
  });
  it("coreGetUserById", () => {
    adapterUsers.setData([user1, user2, user3]);
    expect(serviceUsers.coreGetUserById(1)).toBe(user1);
    expect(serviceUsers.coreGetUserById(2)).toBe(user2);
    expect(serviceUsers.coreGetUserById(10)).toBe(null);
  });
  it("coreGetUserByEmail", () => {
    adapterUsers.setData([user1, user2, user3]);
    expect(serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    expect(serviceUsers.coreGetUserByEmail(user2.email)).toBe(user2);
    expect(serviceUsers.coreGetUserByEmail("test@test.com")).toBe(null);
  });
  it("coreCreateInitialUserIfNoUsersAtAll", () => {
    adapterUsers.setData([user1, user2, user3]);
    serviceUsers.coreCreateInitialUserIfNoUsersAtAll("test@test.com", "10");
    expect(serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    expect(serviceUsers.coreGetUserByEmail(user2.email)).toBe(user2);
    expect(serviceUsers.coreGetUserByEmail("test@test.com")).toBe(null);
    adapterUsers.setData([]);
    serviceUsers.coreCreateInitialUserIfNoUsersAtAll("test@test.com", "10");
    expect(serviceUsers.coreGetUserByEmail(user1.email)).toBe(null);
    expect(serviceUsers.coreGetUserByEmail("test@test.com")).toMatchObject({
      email: "test@test.com",
      password: "10",
    });
  });
  it("getUserList", () => {
    adapterUsers.setData([user1, user2, user3]);
    expect(() => serviceUsers.getUserList(user1)).toThrowError();
    expect(serviceUsers.getUserList(admin)).toMatchObject([
      user1,
      user2,
      user3,
    ]);
  });
  it("createUser", () => {
    adapterUsers.setData([user1, user2]);
    expect(() => serviceUsers.createUser(user1, user3)).toThrowError();
    expect(() => serviceUsers.createUser(admin, user3)).not.toThrowError();
    expect(serviceUsers.coreGetUserByEmail(user3.email)).toMatchObject({
      email: user3.email,
    });
    expect(() =>
      serviceUsers.createUser(admin, { ...user3, email: "wrong email" })
    ).toThrowError();
  });
  it("deleteUser", () => {
    adapterUsers.setData([user1, user2]);
    expect(() => serviceUsers.deleteUser(user1, user3)).toThrowError();
    expect(() => serviceUsers.deleteUser(admin, user3)).not.toThrowError();
    expect(serviceUsers.coreGetUserByEmail(user1.email)).toBe(user1);
    expect(() => serviceUsers.deleteUser(admin, user1)).not.toThrowError();
    expect(serviceUsers.coreGetUserByEmail(user1.email)).toBe(null);
  });
  it("getUserById", () => {
    adapterUsers.setData([user1, user2]);
    expect(() => serviceUsers.getUserById(user1, user1.id)).not.toThrowError();
    expect(() => serviceUsers.getUserById(user1, user2.id)).toThrowError();
    expect(() => serviceUsers.getUserById(admin, user2.id)).not.toThrowError();
    expect(serviceUsers.getUserById(admin, user2.id)).toMatchObject({
      ...user2,
      password: "*",
    });
  });

  it("updateUser", () => {
    adapterUsers.setData([user1, user2]);
    //can update myself
    expect(() =>
      serviceUsers.updateUser(user1, user1, {
        email: "1@test.com",
        isAdmin: true,
      })
    ).not.toThrowError();
    //but can't provide admin's privileges
    expect(serviceUsers.getUserById(admin, user1.id)).toMatchObject({
      email: "1@test.com",
      isAdmin: false,
    });
    expect(() =>
      serviceUsers.updateUser(admin, user1, {
        email: "2@test.com",
        isAdmin: true,
      })
    ).not.toThrowError();
    //admin can provide admin's privileges
    expect(serviceUsers.getUserById(admin, user1.id)).toMatchObject({
      email: "2@test.com",
      isAdmin: true,
    });
    // but nobody can set non-uniq email
    expect(() =>
      serviceUsers.updateUser(admin, user1, {
        email: user2.email,
      })
    ).toThrowError();
  });
});
