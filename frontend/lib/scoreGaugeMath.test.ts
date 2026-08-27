import { describe, expect, it } from "vitest";
import { scoreDashOffset } from "./scoreGaugeMath";

describe("scoreDashOffset", () => {
  it("returns the full circumference (nothing drawn) at score 0", () => {
    expect(scoreDashOffset(0, 100)).toBe(100);
  });

  it("returns zero (fully drawn) at score 100", () => {
    expect(scoreDashOffset(100, 100)).toBe(0);
  });

  it("returns half the circumference at score 50", () => {
    expect(scoreDashOffset(50, 100)).toBe(50);
  });

  it("clamps a score above 100", () => {
    expect(scoreDashOffset(150, 100)).toBe(0);
  });

  it("clamps a score below 0", () => {
    expect(scoreDashOffset(-10, 100)).toBe(100);
  });
});
