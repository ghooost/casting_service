import { describe, expect, it } from "vitest";

import { maskPrivateData } from "./users";

import { User } from "@shared/user";

describe("users", () => {
  it("maskPrivateData", () => {
    const user: User = {
      id: 1,
      email: "some1@email.com",
      password: "",
      isAdmin: true,
    };
    expect(maskPrivateData({ ...user, password: "test" })).toMatchObject({
      ...user,
      password: "*",
    });
    expect(maskPrivateData({ ...user })).toMatchObject({
      ...user,
      password: "*",
    });
  });
});
