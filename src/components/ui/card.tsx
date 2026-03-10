import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-slate-800 border border-slate-700 rounded-lg",
        "transition-all duration-150",
        interactive
          ? "cursor-pointer hover:border-cyan-400/50 hover:shadow-md hover:shadow-cyan-400/5"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["px-4 pt-4 pb-2 flex items-start justify-between gap-2", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={["text-lg font-semibold text-slate-100 leading-snug", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["px-4 pb-4 text-slate-400 text-sm", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "px-4 pb-4 pt-2 flex items-center gap-2",
        "border-t border-slate-700/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
