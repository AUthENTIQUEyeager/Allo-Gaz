import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-flame-500 text-white hover:bg-flame-600 shadow-soft",
  secondary: "bg-ink-800 text-white hover:bg-ink-900",
  outline: "border border-flame-500 text-flame-500 hover:bg-flame-50",
  ghost: "text-ink-800 hover:bg-flame-50"
};

export default function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
