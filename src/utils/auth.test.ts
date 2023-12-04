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

describe("Server auth", () => {
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
    owners: new Set([owner]),
    stuff: new Set([stuff]),
    castings: new Set(),
  };
  const testString = "test string";

  it("canManageServiceLevel", () => {
    expect(canManageServiceLevel(admin), "for isAdmin").toBe(true);
    expect(canManageServiceLevel(stuff), "for non admin").toBe(false);
    expect(canManageServiceLevel(null), "for null").toBe(false);
    expect(canManageServiceLevel(undefined), "for undefined").toBe(false);
  });
  it("canManageCompanyLevel", () => {
    expect(canManageCompanyLevel(null, null)).toBe(false);
    expect(canManageCompanyLevel(admin, null)).toBe(false);
    expect(canManageCompanyLevel(admin, company)).toBe(true);
    expect(canManageCompanyLevel(owner, company)).toBe(true);
    expect(canManageCompanyLevel(stuff, company)).toBe(false);
    expect(canManageCompanyLevel(other, company)).toBe(false);
  });
  it("canManageStuffLevel", () => {
    expect(canManageStuffLevel(null, null)).toBe(false);
    expect(canManageStuffLevel(admin, null)).toBe(false);
    expect(canManageStuffLevel(admin, company)).toBe(true);
    expect(canManageStuffLevel(owner, company)).toBe(true);
    expect(canManageStuffLevel(stuff, company)).toBe(true);
    expect(canManageStuffLevel(other, company)).toBe(false);
  });
  it("checkAuthAdmin", () => {
    const fn = vi.fn();
    const newFn = checkAuthAdmin(fn);
    newFn(admin, testString, testString);
    expect(() => newFn(owner, testString)).toThrowError(ForbiddenError);
    expect(() => newFn(null, testString)).toThrowError(ForbiddenError);
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    expect(fn).toBeCalledTimes(1);
  });

  it("checkAuthOwner", () => {
    const fn = vi.fn();
    const newFn = checkAuthOwner(fn);
    expect(() =>
      newFn(admin, company, testString, testString)
    ).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    expect(() => newFn(owner, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([testString]);
    expect(() => newFn(null, company, testString)).toThrowError();
    expect(() => newFn(stuff, company, testString)).toThrowError();
    expect(() => newFn(other, company, testString)).toThrowError();
    expect(() => newFn(other, null, testString)).toThrowError();
    expect(() => newFn(admin, null, testString)).toThrowError();
    expect(fn).toBeCalledTimes(2);
  });

  it("checkAuthOwnerWithCompany", () => {
    const fn = vi.fn();
    const newFn = checkAuthOwnerWithCompany(fn);
    expect(() =>
      newFn(admin, company, testString, testString)
    ).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([company, testString, testString]);
    expect(() => newFn(owner, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([company, testString]);
    expect(() => newFn(null, company, testString)).toThrowError();
    expect(() => newFn(stuff, company, testString)).toThrowError();
    expect(() => newFn(other, company, testString)).toThrowError();
    expect(() => newFn(other, null, testString)).toThrowError();
    expect(() => newFn(admin, null, testString)).toThrowError();
    expect(fn).toBeCalledTimes(2);
  });

  it("checkAuthStuff", () => {
    const fn = vi.fn();
    const newFn = checkAuthStuff(fn);
    expect(() =>
      newFn(admin, company, testString, testString)
    ).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([testString, testString]);
    expect(() => newFn(owner, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([testString]);
    expect(() => newFn(stuff, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([testString]);

    expect(() => newFn(null, company, testString)).toThrowError();
    expect(() => newFn(other, company, testString)).toThrowError();
    expect(() => newFn(other, null, testString)).toThrowError();
    expect(() => newFn(admin, null, testString)).toThrowError();
    expect(fn).toBeCalledTimes(3);
  });

  it("checkAuthStuffWithCompany", () => {
    const fn = vi.fn();
    const newFn = checkAuthStuffWithCompany(fn);
    expect(() =>
      newFn(admin, company, testString, testString)
    ).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([company, testString, testString]);
    expect(() => newFn(owner, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([company, testString]);
    expect(() => newFn(stuff, company, testString)).not.toThrowError();
    expect(fn.mock.lastCall).toMatchObject([company, testString]);

    expect(() => newFn(null, company, testString)).toThrowError();
    expect(() => newFn(other, company, testString)).toThrowError();
    expect(() => newFn(other, null, testString)).toThrowError();
    expect(() => newFn(admin, null, testString)).toThrowError();
    expect(fn).toBeCalledTimes(3);
  });
});
