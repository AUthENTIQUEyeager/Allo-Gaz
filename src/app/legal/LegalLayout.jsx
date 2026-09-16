import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default function LegalLayout({ children }) {
  return (
    <div className="min-h-screen bg-flame-50/30">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-black/5 bg-white/80 px-5 py-3 backdrop-blur-md md:px-8">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-ink-800/60 hover:text-flame-500">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div className="ml-auto flex items-center gap-1.5 text-ink-800/40">
          <Flame className="h-4 w-4 text-flame-500" fill="currentColor" strokeWidth={0} />
          <span className="text-xs font-medium">AlloGaz</span>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-8 md:px-8">
        <article className="prose-legal space-y-5 text-sm leading-relaxed text-ink-800/80">
          {children}
        </article>
      </main>
    </div>
  );
}
