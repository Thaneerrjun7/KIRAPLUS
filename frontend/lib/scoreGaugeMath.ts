// Pure geometry for ScoreGauge's hand-rolled SVG semicircle arc (design.md's "Chart choices" --
// no charting library for the gauge). The arc is a fixed semicircle path drawn with
// stroke-dasharray = circumference, so the visible fraction is controlled by dashoffset alone.

export function scoreDashOffset(score: number, circumference: number): number {
  const clamped = Math.max(0, Math.min(100, score));
  return circumference * (1 - clamped / 100);
}
