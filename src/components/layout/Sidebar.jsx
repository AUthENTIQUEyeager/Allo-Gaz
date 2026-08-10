"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { CLIENT_NAV, VENDOR_NAV, ADMIN_NAV } from "@/lib/navConfig";

const NAV_BY_ROLE = { client: CLIENT_NAV, vendor: VENDOR_NAV, admin: ADMIN_NAV };
const LABEL_BY_ROLE = { client: "Espace client", vendor: "Espace vendeur", admin: "Administration" };

export default function Sidebar({ role, name }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] || [];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-black/5 bg-white md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <Flame className="h-6 w-6 text-flame-500" fill="currentColor" strokeWidth={0} />
        <span className="font-display text-lg font-medium text-ink-800">AlloGaz</span>
      </div>

      <div className="px-6 pb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-800/40">{LABEL_BY_ROLE[role]}</p>
        {name && <p className="mt-0.5 truncate text-sm font-medium text-ink-800">{name}</p>}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-flame-50 text-flame-600" : "text-ink-800/60 hover:bg-black/5"
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.2 : 1.8} />
              {itemLabel}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-800/50 transition-colors hover:bg-black/5"
        >
          <LogOut className="h-4.5 w-4.5" /> Deconnexion
        </button>
      </form>
    </aside>
  );
}
