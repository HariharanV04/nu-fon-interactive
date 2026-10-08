export const SPARK_COUNT = 5;
export function clampPosition(value: number, size: number, radius = 28) {
  return Math.max(radius, Math.min(size - radius, value));
}
export function isSparkCollected(player: { x: number; y: number }, spark: { x: number; y: number }) {
  return Math.hypot(player.x - spark.x, player.y - spark.y) < 48;
}