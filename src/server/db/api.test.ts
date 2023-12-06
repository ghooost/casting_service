import { describe, expect, it } from "vitest";

import {
  makeApiForMap,
  makeChildArrayApi,
  makeChildArrayApiEditable,
  makeChildArrayApiLinkable,
} from "./api";

import { ProcessingError } from "@shared/error";
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
  it("makeApiForMap", async () => {
    const collection = new Map<User["id"], User>();
    const api = makeApiForMap(
      collection,
      (): User => ({ ...defItem }),
      true,
      10
    );
    expect(await api.isEmpty()).toBe(true);
    await api.add({ email: "2" });
    await api.add({ email: "3" });

    expect(await api.filter()).toMatchObject([user1, user2]);
    expect(await api.filter(({ email }) => email === "3")).toMatchObject([
      user2,
    ]);
    expect(await api.find(11)).toMatchObject(user1);

    expect(await api.hasId(11)).toBe(true);
    expect(await api.hasId(10)).toBe(false);

    expect(await api.isEmpty()).toBe(false);
    expect(await api.update(11, { email: "updated" })).toMatchObject({
      ...user1,
      email: "updated",
    });
    const item = await api.find(11);
    expect(item).not.toBeNull();
    if (item) {
      await api.remove(item);
      expect(await api.find(11)).toBeNull();
    }
    try {
      await api.setData([]);
      expect(false, "setData should throw error").toBe(true);
    } catch (e) {
      expect(e).toBeInstanceOf(ProcessingError);
    }
  });

  it("makeApiForMap - with unlocked setData", async () => {
    const collection = new Map<User["id"], User>();
    const api = makeApiForMap(
      collection,
      (): User => ({ ...defItem }),
      false,
      10
    );
    await api.add({ email: "2" });
    await api.add({ email: "3" });
    try {
      await api.setData([]);
      expect(true, "setData should process well").toBe(true);
    } catch (e) {
      expect(false, "setData shouldn't throw error").toBe(true);
    }
    expect(await api.isEmpty()).toBe(true);
  });

  it("makeChildArrayApi", async () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApi(
      ({ collection }: typeof parentObj) => collection
    );
    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(await api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(
      await api.filter(parentObj, ({ email }) => email === "3")
    ).toMatchObject([user2]);
    expect(await api.find(parentObj, 11)).toMatchObject(user1);

    expect(await api.hasId(parentObj, 11)).toBe(true);
    expect(await api.hasId(parentObj, 10)).toBe(false);

    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(await api.update(parentObj, 11, { email: "updated" })).toMatchObject(
      {
        ...user1,
        email: "updated",
      }
    );
    const item = await api.find(parentObj, 11);
    expect(item).not.toBeNull();
  });

  it("makeChildArrayApiLinkable", async () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApiLinkable(
      ({ collection }: typeof parentObj) => collection
    );
    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(await api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(
      await api.filter(parentObj, ({ email }) => email === "3")
    ).toMatchObject([user2]);
    expect(await api.find(parentObj, 11)).toMatchObject(user1);

    expect(await api.hasId(parentObj, 11)).toBe(true);
    expect(await api.hasId(parentObj, 10)).toBe(false);

    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(
      await api.update(parentObj, 11, { email: "updated", password: "pas" })
    ).toMatchObject({
      ...user1,
      email: "updated",
      password: "pas",
    });
    const item = await api.find(parentObj, 11);
    expect(item).not.toBeNull();
    expect(item).not.toBeUndefined();
    if (item) {
      await api.unlink(parentObj, item);
    }
    expect(await api.find(parentObj, 11)).toBeNull();
    expect(await api.link(parentObj, user1)).toMatchObject(user1);
    expect(await api.find(parentObj, 11)).toMatchObject(user1);
  });

  it("makeChildArrayApiEditable", async () => {
    const parentObj = {
      collection: [user1, user2],
    };
    const api = makeChildArrayApiEditable(
      ({ collection }: typeof parentObj) => collection,
      () => ({ ...defItem }),
      10
    );
    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(await api.filter(parentObj)).toMatchObject([user1, user2]);
    expect(
      await api.filter(parentObj, ({ email }) => email === "3")
    ).toMatchObject([user2]);
    expect(await api.find(parentObj, 11)).toMatchObject(user1);

    expect(await api.hasId(parentObj, 11)).toBe(true);
    expect(await api.hasId(parentObj, 10)).toBe(false);

    expect(await api.isEmpty(parentObj)).toBe(false);
    expect(
      await api.update(parentObj, 11, { email: "updated", password: "pas" })
    ).toMatchObject({
      ...user1,
      email: "updated",
      password: "pas",
    });
    expect(await api.find(parentObj, 11)).toMatchObject(user1);
    expect(await api.find(parentObj, 11)).toBe(user1);
    await api.remove(parentObj, user1);
    expect(await api.hasId(parentObj, 11)).toBe(false);
    expect(await api.add(parentObj, user1)).toMatchObject(user1);
    expect(await api.has(parentObj, user1)).toBe(false);
  });
});
