export default function DesktopTopbar({ title, subtitle }) {
  if (!title) return null;
  return (
    <div className="hidden border-b border-black/5 bg-white px-8 py-6 md:block">
      <h1 className="font-display text-xl font-medium text-ink-800">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-ink-800/50">{subtitle}</p>}
    </div>
  );
}
