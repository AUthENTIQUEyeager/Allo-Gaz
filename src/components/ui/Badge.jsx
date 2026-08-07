import { cn } from "@/lib/utils";

export default function Badge({ children, className }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}
