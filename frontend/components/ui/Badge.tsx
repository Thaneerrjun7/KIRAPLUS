type RiskLevel = "low" | "moderate" | "high" | "neutral";

const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "text-risk-low",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
  neutral: "text-navy/50",
};

type Props = {
  children: string;
  risk?: RiskLevel;
};

export function Badge({ children, risk = "neutral" }: Props) {
  return (
    <span className={`font-mono text-xs font-medium uppercase tracking-wide ${RISK_CLASSES[risk]}`}>
      [{children}]
    </span>
  );
}
