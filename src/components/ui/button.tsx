import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-400 text-slate-950 hover:bg-cyan-500 font-semibold",
  secondary:
    "border border-slate-700 text-slate-100 hover:border-cyan-400 hover:text-cyan-400 bg-transparent",
  ghost:
    "text-slate-400 hover:text-slate-100 hover:bg-slate-800 bg-transparent",
  danger:
    "border border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded",
  md: "h-10 px-4 text-sm rounded-md",
  lg: "h-11 px-6 text-base rounded-md",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2",
          "transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
