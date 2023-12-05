import { describe, expect, it } from "vitest";

import {
  makeApiForMap,
  makeChildArrayApi,
  makeChildArrayApiEditable,
  makeChildArrayApiLinkable,
} from "./api";

import { User } from "@shared/user";

describe("db/api", () => {
  const defItem = {
    id: 1,
    email: "1",
    password: "1",
    isAdmin: false,
  };
  const user1 = {
    id: 11,
    email: "2",
    password: "1",
    isAdmin: false,
  };
  const user2 = {
    id: 12,
    email: "3",
    password: "1",
    isAdmin: false,
  };
  it("makeApiForMap", () => {
    const collection = new Map<User["id"], User>();
    const api = makeApiForMap(collection, (): User => ({ ...defItem }), 10);
    expect(api.isEmpty()).toBe(true);
    api.add({ email: "2" });
    api.add({ email: "3" });

    expect(api.filter()).toMatchObject([user1, user2]);
    expect(api.filter(({ email }) => email === "3")).toMatchObject([user2]);
    expect(api.find(11)).toMatchObject(user1);

    expect(api.hasId(11)).toBe(true);
    expect(api.hasId(10)).toBe(false);

    expect(api.isEmpty()).toBe(false);
    expect(api.update(11, { email: "updated" })).toMatchObject({
      ...user1,
      email: "updated",
    });
    const item = api.find(11);
    expect(item).not.toBeNull();
    if (item) {
      api.remove(item);
      expect(api.find(11)).toBeNull();
    }
    expect(() => api.setData([])).toThrowError();
  });

  it("makeApiForMap - with unlocked setData", () => {
    const collection = new Map<User["id"], User>();
    const api = makeApiForMap(
      collection,
      (): User => ({ ...defItem }),
      10,
      false
    );
    api.add({ email: "2" });
    api.add({ email: "3" });
    expect(() => api.setData([])).not.toThrowError();
    expect(api.isEmpty()).toBe(true);
  });

  it("makeChildArrayApi", () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApi(
      ({ collection }: typeof parentObj) => collection
    );
    expect(api.isEmpty(parentObj)).toBe(false);
    expect(api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(api.filter(parentObj, ({ email }) => email === "3")).toMatchObject([
      user2,
    ]);
    expect(api.find(parentObj, 11)).toMatchObject(user1);

    expect(api.hasId(parentObj, 11)).toBe(true);
    expect(api.hasId(parentObj, 10)).toBe(false);

    expect(api.isEmpty(parentObj)).toBe(false);
    expect(api.update(parentObj, 11, { email: "updated" })).toMatchObject({
      ...user1,
      email: "updated",
    });
    const item = api.find(parentObj, 11);
    expect(item).not.toBeNull();
  });

  it("makeChildArrayApiLinkable", () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApiLinkable(
      ({ collection }: typeof parentObj) => collection
    );
    expect(api.isEmpty(parentObj)).toBe(false);
    expect(api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(api.filter(parentObj, ({ email }) => email === "3")).toMatchObject([
      user2,
    ]);
    expect(api.find(parentObj, 11)).toMatchObject(user1);

    expect(api.hasId(parentObj, 11)).toBe(true);
    expect(api.hasId(parentObj, 10)).toBe(false);

    expect(api.isEmpty(parentObj)).toBe(false);
    expect(
      api.update(parentObj, 11, { email: "updated", password: "pas" })
    ).toMatchObject({
      ...user1,
      email: "updated",
      password: "pas",
    });
    const item = api.find(parentObj, 11);
    expect(item).not.toBeNull();
    expect(item).not.toBeUndefined();
    if (item) {
      api.unlink(parentObj, item);
    }
    expect(api.find(parentObj, 11)).toBeNull();
    expect(api.link(parentObj, user1)).toMatchObject(user1);
    expect(api.find(parentObj, 11)).toMatchObject(user1);
  });

  it("makeChildArrayApiEditable", () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApiEditable(
      ({ collection }: typeof parentObj) => collection,
      () => ({ ...defItem }),
      10
    );
    expect(api.isEmpty(parentObj)).toBe(false);
    expect(api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(api.filter(parentObj, ({ email }) => email === "3")).toMatchObject([
      user2,
    ]);
    expect(api.find(parentObj, 11)).toMatchObject(user1);

    expect(api.hasId(parentObj, 11)).toBe(true);
    expect(api.hasId(parentObj, 10)).toBe(false);

    expect(api.isEmpty(parentObj)).toBe(false);
    expect(
      api.update(parentObj, 11, { email: "updated", password: "pas" })
    ).toMatchObject({
      ...user1,
      email: "updated",
      password: "pas",
    });
    expect(api.find(parentObj, 11)).toMatchObject(user1);
    expect(api.find(parentObj, 11)).toBe(user1);
    api.remove(parentObj, user1);
    expect(api.hasId(parentObj, 11)).toBe(false);
    expect(api.add(parentObj, user1)).toMatchObject(user1);
    expect(api.has(parentObj, user1)).toBe(false);
  });
});
