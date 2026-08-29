type Props = {
  className?: string;
};

export function Spinner({ className = "" }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-teal align-[-3px] ${className}`.trim()}
    />
  );
}
