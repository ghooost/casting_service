import { describe, expect, it } from "vitest";

import { updateObject } from "./objects";

describe("utils/objects", () => {
  it("updateObject", () => {
    expect(
      updateObject(
        {
          field1: 1,
          field2: 2,
        },
        {
          field1: 3,
          field4: 4,
        }
      )
    ).toMatchObject({
      field1: 3,
      field2: 2,
    });
  });
});
