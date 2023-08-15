const { convertMilesToKilometers } = require("../common/helper.js");

describe("convertMilelsToKilometers", () => {
  test("if outcome is correct", () => {
    expect(convertMilesToKilometers(1)).toBe(1.61);
    expect(convertMilesToKilometers(-1)).toBe(1.61);
    expect(convertMilesToKilometers(10)).toBe(16.1);
    expect(convertMilesToKilometers(5.27)).toBe(8.4847);
  });

  test("if the user can send text", () => {
    expect(convertMilesToKilometers("hello")).toBeUndefined();
    expect(convertMilesToKilometers("hello", 1291)).toBeUndefined();
    expect(convertMilesToKilometers()).toBeUndefined();
    expect(convertMilesToKilometers({ number: 10 })).toBeUndefined();
  });
});