import * as React from "react";

type BadgeVariant = "default" | "accent" | "danger" | "success";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-700 text-slate-300",
  accent:  "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30",
  danger:  "bg-red-400/15 text-red-400 border border-red-400/30",
  success: "bg-green-400/15 text-green-400 border border-green-400/30",
};

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
