import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function Card({ children, className = "", label }: Props) {
  return (
    <div className={`relative rounded-xl border border-border bg-surface ${className}`.trim()}>
      {label && (
        <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-mist">
          {label}
        </span>
      )}
      <div className={label ? "pt-4" : ""}>{children}</div>
    </div>
  );
}
