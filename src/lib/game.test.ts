import { describe, expect, it } from "vitest";
import { clampPosition, isSparkCollected, SPARK_COUNT } from "./game";
describe("doodle exploration", () => {
  it("keeps the player within the screen", () => {
    expect(clampPosition(-100, 1280)).toBe(28);
    expect(clampPosition(1400, 1280)).toBe(1252);
    expect(clampPosition(500, 1280)).toBe(500);
  });
  it("collects only sparks within reach", () => {
    expect(isSparkCollected({x:100,y:100},{x:120,y:110})).toBe(true);
    expect(isSparkCollected({x:100,y:100},{x:180,y:100})).toBe(false);
    expect(SPARK_COUNT).toBe(5);
  });
});