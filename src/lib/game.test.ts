import { describe, expect, it } from "vitest";
import { BASE_SPEED, clampPosition, cooldownFraction, DASH_SPEED, dashDirection, isAbilityReady, isSparkCollected, jumpOffset, movementSpeed, SPARK_COUNT } from "./game";
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
describe("abilities", () => {
  it("respects cooldowns", () => {
    expect(isAbilityReady(1000, 0, 1200)).toBe(false);
    expect(isAbilityReady(1200, 0, 1200)).toBe(true);
    expect(cooldownFraction(600, 0, 1200)).toBe(0.5);
    expect(cooldownFraction(5000, 0, 1200)).toBe(0);
  });
  it("boosts speed only during a dash", () => {
    expect(movementSpeed(1100, 1000)).toBe(DASH_SPEED);
    expect(movementSpeed(1500, 1000)).toBe(BASE_SPEED);
  });
  it("dashes toward input, else facing", () => {
    expect(dashDirection(1, 0, {x:0,y:1})).toEqual({x:1,y:0});
    expect(dashDirection(0, 0, {x:0,y:-1})).toEqual({x:0,y:-1});
    expect(dashDirection(0, 0, {x:0,y:0})).toEqual({x:1,y:0});
  });
  it("hop lifts visually and lands", () => {
    expect(jumpOffset(0, 0)).toBe(0);
    expect(jumpOffset(260, 0)).toBeCloseTo(34);
    expect(jumpOffset(600, 0)).toBe(0);
  });
});
