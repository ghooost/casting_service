import { describe, expect, it } from "vitest";

import {
  normalizeBool,
  normalizeEmail,
  normalizePhone,
  normalizeString,
  trimNonLetters,
  trimWhitespaces,
} from "./normalize";

describe("normalize", () => {
  it("trimWhitespaces", () => {
    expect(trimWhitespaces("  test")).toBe("test");
  });
  it("trimNonLetters", () => {
    expect(trimNonLetters("  test")).toBe("test");
    expect(trimNonLetters("@#$%test@test.com%^& ")).toMatchObject(
      "test@test.com"
    );
  });
  it("normalizeString", () => {
    expect(normalizeString("  test")).toBe("test");
    expect(normalizeString("@#$%test@test.com%^& ")).toBe(
      "@#$%test@test.com%^&"
    );
  });
  it("normalizePhone", () => {
    expect(normalizePhone("test")).toBe("");
    expect(normalizePhone("123456sadf")).toBe("");
    expect(normalizePhone("1233345")).toBe("");
    expect(normalizePhone("89171825205", "RU")).toBe("+7 917 182 52 05");
    expect(normalizePhone("+3809171825205", "FI")).toBe("+380 917 182 5205");
  });
  it("normalizeEmail", () => {
    expect(normalizeEmail("test")).toBe("");
    expect(normalizeEmail("123456sadf")).toBe("");
    expect(normalizeEmail("test@test.com ")).toBe("test@test.com");
    expect(normalizeEmail("@test@test.com++")).toBe("test@test.com");
  });
  it("normalizeBool", () => {
    expect(normalizeBool("true")).toBe(true);
    expect(normalizeBool("false")).toBe(false);
    expect(normalizeBool(true)).toBe(true);
    expect(normalizeBool(false)).toBe(false);
    expect(normalizeBool(0)).toBe(false);
    expect(normalizeBool(1)).toBe(true);
    expect(normalizeBool(42)).toBe(true);
    expect(normalizeBool("somethjing")).toBe(false);
  });
});
