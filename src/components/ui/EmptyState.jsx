export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-12 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-ink-800/20" strokeWidth={1.5} />}
      <p className="font-display text-base font-medium text-ink-800">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-ink-800/50">{description}</p>}
    </div>
  );
}
