import { cn } from "@/lib/utils";

export default function Input({ label, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink-800">{label}</span>}
      <input
        className={cn(
          "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-flame-400 focus:ring-2 focus:ring-flame-100",
          className
        )}
        {...props}
      />
    </label>
  );
}
