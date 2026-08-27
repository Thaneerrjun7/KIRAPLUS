type Props = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function StatTile({ label, value, valueClassName = "" }: Props) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm">{label}</span>
      <span className="mb-0.5 flex-1 border-b border-dotted border-navy/30" />
      <span className={`font-mono text-sm ${valueClassName}`.trim()}>{value}</span>
    </div>
  );
}
