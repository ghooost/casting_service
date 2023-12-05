import { expect, it } from "vitest";

import { selectContext } from "./context";

import { Context, RequestWithContext } from "@shared/context";

it("utils/selectContext", () => {
  const context: Context = {
    session: null,
    author: null,
  };

  const requestWithContext = {
    context,
  } as RequestWithContext;

  const requestWithoutContext = {} as RequestWithContext;

  expect(selectContext(requestWithContext)).toMatchObject(context);
  expect(() => selectContext(requestWithoutContext)).toThrowError();
});
