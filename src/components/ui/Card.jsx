import { cn } from "@/lib/utils";

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl bg-white p-4 shadow-card border border-black/5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
