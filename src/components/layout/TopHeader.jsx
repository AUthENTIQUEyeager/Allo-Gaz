import { Flame, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export default function TopHeader({ title, subtitle, homeHref }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-flame-500 to-ember-500 px-5 pb-6 pt-5 text-white md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          <Flame className="h-6 w-6" fill="white" strokeWidth={0} />
          <span className="font-display text-lg font-medium">AlloGaz</span>
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium"
          >
            <LogOut className="h-3.5 w-3.5" /> Deconnexion
          </button>
        </form>
      </div>
      {title && (
        <div className="mx-auto mt-4 max-w-lg">
          <h1 className="font-display text-xl font-medium">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-white/80">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
