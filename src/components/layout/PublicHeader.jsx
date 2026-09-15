import Link from "next/link";
import { Flame } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/5 bg-white/80 px-5 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-flame-500" fill="currentColor" strokeWidth={0} />
        <span className="font-display text-base font-medium text-ink-800">AlloGaz</span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" className="px-3 py-2 text-xs md:text-sm">
            Se connecter
          </Button>
        </Link>
        <Link href="/register">
          <Button className="px-3 py-2 text-xs md:text-sm">S&apos;inscrire</Button>
        </Link>
      </div>
    </header>
  );
}
