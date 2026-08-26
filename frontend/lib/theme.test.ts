import { describe, expect, it } from "vitest";
import { bandToRisk } from "./theme";

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
