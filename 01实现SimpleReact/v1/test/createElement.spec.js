import React from "../package/React.js";
import { it, expect, describe } from "vitest";

describe("createElement", () => {
  it("should create a simple element", () => {
    const element = React.createElement("div", null, "Hello, world!");

    expect(element).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "Hello, world!",
              children: [],
            },
          },
        ],
      },
    });
  });
});
