import { verifyHMac } from "./utils";

describe("Utils", () => {
  it("Can verify a webhook signature", () => {
    const result = verifyHMac(
      "ExampleSecretJustForTesting",
      '{"example": "Please do not alter the JSON formatting, the body should be used as-is"}',
      "yHe0ALeSA8vdSagOvh6bNCtOQCBY9R6tr5xQfJH69ng="
    );

    expect(result).toBe(true);
  });
});
