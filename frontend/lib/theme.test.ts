import { describe, expect, it } from "vitest";
import { bandToRisk, verdictLevelToRisk, warningLevelToRisk } from "./theme";

describe("bandToRisk", () => {
  it("maps LOW RISK to low", () => {
    expect(bandToRisk("LOW RISK")).toBe("low");
  });

  it("maps MODERATE RISK to moderate", () => {
    expect(bandToRisk("MODERATE RISK")).toBe("moderate");
  });

  it("maps HIGH RISK to high", () => {
    expect(bandToRisk("HIGH RISK")).toBe("high");
  });
});

describe("warningLevelToRisk", () => {
  it("maps amber to moderate", () => {
    expect(warningLevelToRisk("amber")).toBe("moderate");
  });

  it("maps red to high", () => {
    expect(warningLevelToRisk("red")).toBe("high");
  });
});

describe("verdictLevelToRisk", () => {
  it("maps green to low", () => {
    expect(verdictLevelToRisk("green")).toBe("low");
  });

  it("maps amber to moderate", () => {
    expect(verdictLevelToRisk("amber")).toBe("moderate");
  });

  it("maps red to high", () => {
    expect(verdictLevelToRisk("red")).toBe("high");
  });
});
