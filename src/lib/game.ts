export const SPARK_COUNT = 5;
export const BASE_SPEED = 6;
export const DASH_SPEED = 18;
export const DASH_DURATION = 180;
export const DASH_COOLDOWN = 1200;
export const JUMP_DURATION = 520;
export const JUMP_COOLDOWN = 900;
export const JUMP_HEIGHT = 34;

export function clampPosition(value: number, size: number, radius = 28) {
  return Math.max(radius, Math.min(size - radius, value));
}
export function isSparkCollected(player: { x: number; y: number }, spark: { x: number; y: number }) {
  return Math.hypot(player.x - spark.x, player.y - spark.y) < 48;
}
/** True when an ability used at `lastUsed` is ready again at `now`. */
export function isAbilityReady(now: number, lastUsed: number, cooldown: number) {
  return now - lastUsed >= cooldown;
}
/** Remaining cooldown as a 0..1 fraction (1 = just used, 0 = ready). */
export function cooldownFraction(now: number, lastUsed: number, cooldown: number) {
  return Math.max(0, Math.min(1, 1 - (now - lastUsed) / cooldown));
}
/** Movement speed for the current frame, boosted while a dash is active. */
export function movementSpeed(now: number, dashStart: number) {
  return now - dashStart < DASH_DURATION ? DASH_SPEED : BASE_SPEED;
}
/** Normalised dash direction: input direction, else last facing, else right. */
export function dashDirection(x: number, y: number, facing: { x: number; y: number }) {
  const [dx, dy] = x || y ? [x, y] : [facing.x, facing.y];
  const len = Math.hypot(dx, dy);
  return len ? { x: dx / len, y: dy / len } : { x: 1, y: 0 };
}
/** Visual-only vertical lift (px) for a hop started at `jumpStart`; 0 outside the hop. */
export function jumpOffset(now: number, jumpStart: number, height = JUMP_HEIGHT) {
  const t = (now - jumpStart) / JUMP_DURATION;
  if (t < 0 || t >= 1) return 0;
  return Math.sin(t * Math.PI) * height;
}
