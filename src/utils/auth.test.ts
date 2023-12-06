import { it, expect, describe, vi } from "vitest";

import {
  canManageCompanyLevel,
  canManageServiceLevel,
  canManageStuffLevel,
  checkAuthAdmin,
  checkAuthOwner,
  checkAuthOwnerWithCompany,
  checkAuthStuff,
  checkAuthStuffWithCompany,
} from "./auth";

import { Company } from "@shared/company";
import { ForbiddenError } from "@shared/error";
import { User } from "@shared/user";

describe("utils/auth", () => {
  const admin: User = {
    id: 1,
    email: "some1@email.com",
    password: "*",
    isAdmin: true,
  };
  const owner: User = {
    id: 2,
    email: "some2@email.com",
    password: "*",
    isAdmin: false,
  };
  const stuff: User = {
    id: 3,
    email: "some3@email.com",
    password: "*",
    isAdmin: false,
  };
  const other: User = {
    id: 4,
    email: "some4@email.com",
    password: "*",
    isAdmin: false,
  };
  const company: Company = {
    id: 1,
    title: "company",
    owners: [owner],
    stuff: [stuff],
    castings: [],
  };
  const testString = "test string";

  it("canManageServiceLevel", async () => {
    expect(await canManageServiceLevel(admin), "for isAdmin").toBe(true);
    expect(await canManageServiceLevel(stuff), "for non admin").toBe(false);
    expect(await canManageServiceLevel(null), "for null").toBe(false);
    expect(await canManageServiceLevel(undefined), "for undefined").toBe(false);
  });
  it("canManageCompanyLevel", async () => {
    expect(await canManageCompanyLevel(null, null)).toBe(false);
    expect(await canManageCompanyLevel(admin, null)).toBe(false);
    expect(await canManageCompanyLevel(admin, company)).toBe(true);
    expect(await canManageCompanyLevel(owner, company)).toBe(true);
    expect(await canManageCompanyLevel(stuff, company)).toBe(false);
    expect(await canManageCompanyLevel(other, company)).toBe(false);
  });
  it("canManageStuffLevel", async () => {
    expect(await canManageStuffLevel(null, null)).toBe(false);
    expect(await canManageStuffLevel(admin, null)).toBe(false);
    expect(await canManageStuffLevel(admin, company)).toBe(true);
    expect(await canManageStuffLevel(owner, company)).toBe(true);
    expect(await canManageStuffLevel(stuff, company)).toBe(true);
    expect(await canManageStuffLevel(other, company)).toBe(false);
  });
  it("checkAuthAdmin", async () => {
    const fn = vi.fn();
    const newFn = checkAuthAdmin(fn);
    await newFn(admin, testString, testString);
    await expect(
      async () => await newFn(owner, testString)
    ).rejects.toThrowError(ForbiddenError);
    await expect(
      async () => await newFn(null, testString)
    ).rejects.toThrowError(ForbiddenError);
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    expect(fn).toBeCalledTimes(1);
  });

  it("checkAuthOwner", async () => {
    const fn = vi.fn();
    const newFn = checkAuthOwner(fn);
    await newFn(admin, company, testString, testString);
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    await newFn(owner, company, testString);
    expect(fn.mock.lastCall).toMatchObject([testString]);
    await expect(
      async () => await newFn(null, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(stuff, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, null, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(admin, null, testString)
    ).rejects.toThrowError();
    expect(fn).toBeCalledTimes(2);
  });

  it("checkAuthOwnerWithCompany", async () => {
    const fn = vi.fn();
    const newFn = checkAuthOwnerWithCompany(fn);
    await newFn(admin, company, testString, testString);
    expect(fn.mock.lastCall).toMatchObject([company, testString, testString]);
    await newFn(owner, company, testString);
    expect(fn.mock.lastCall).toMatchObject([company, testString]);
    expect(
      async () => await newFn(null, company, testString)
    ).rejects.toThrowError();
    expect(
      async () => await newFn(stuff, company, testString)
    ).rejects.toThrowError();
    expect(
      async () => await newFn(other, company, testString)
    ).rejects.toThrowError();
    expect(
      async () => await newFn(other, null, testString)
    ).rejects.toThrowError();
    expect(
      async () => await newFn(admin, null, testString)
    ).rejects.toThrowError();
    expect(fn).toBeCalledTimes(2);
  });

  it("checkAuthStuff", async () => {
    const fn = vi.fn();
    const newFn = checkAuthStuff(fn);
    await newFn(admin, company, testString, testString);
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    await newFn(owner, company, testString);
    expect(fn.mock.lastCall).toMatchObject([testString]);
    await newFn(stuff, company, testString);
    expect(fn.mock.lastCall).toMatchObject([testString]);

    await expect(
      async () => await newFn(null, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, null, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(admin, null, testString)
    ).rejects.toThrowError();
    expect(fn).toBeCalledTimes(3);
  });

  it("checkAuthStuffWithCompany", async () => {
    const fn = vi.fn();
    const newFn = checkAuthStuffWithCompany(fn);
    await newFn(admin, company, testString, testString);
    expect(fn.mock.lastCall).toMatchObject([company, testString, testString]);
    await newFn(owner, company, testString);
    expect(fn.mock.lastCall).toMatchObject([company, testString]);
    await newFn(stuff, company, testString);
    expect(fn.mock.lastCall).toMatchObject([company, testString]);

    await expect(
      async () => await newFn(null, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, company, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(other, null, testString)
    ).rejects.toThrowError();
    await expect(
      async () => await newFn(admin, null, testString)
    ).rejects.toThrowError();
    expect(fn).toBeCalledTimes(3);
  });
});
