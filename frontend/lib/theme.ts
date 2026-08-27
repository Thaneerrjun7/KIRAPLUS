// The band -> risk-color mapping, in exactly one place. See docs/design.md
// ("Risk / band colors") -- actual colors live in tailwind.config.ts as
// bg-risk-{low,moderate,high} etc.; this just names which one a band maps to.

export type Band = "LOW RISK" | "MODERATE RISK" | "HIGH RISK";
export type RiskLevel = "low" | "moderate" | "high";

export function bandToRisk(band: Band): RiskLevel {
  switch (band) {
    case "LOW RISK":
      return "low";
    case "MODERATE RISK":
      return "moderate";
    case "HIGH RISK":
      return "high";
  }
}

export type WarningLevel = "red" | "amber";

export function warningLevelToRisk(level: WarningLevel): RiskLevel {
  return level === "red" ? "high" : "moderate";
}

export type VerdictLevel = "green" | "amber" | "red";

export function verdictLevelToRisk(level: VerdictLevel): RiskLevel {
  switch (level) {
    case "green":
      return "low";
    case "amber":
      return "moderate";
    case "red":
      return "high";
  }
}
