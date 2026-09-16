import Link from "next/link";
import { Shield, FileText, Cookie, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";

const LINKS = [
  { href: "/legal/confidentialite", label: "Politique de confidentialité", icon: Shield },
  { href: "/legal/mentions-legales", label: "Mentions légales", icon: FileText },
  { href: "/legal/cookies", label: "Politique de cookies", icon: Cookie }
];

export default function LegalLinks() {
  return (
    <Card className="space-y-1 p-2">
      <p className="px-2.5 pb-1 pt-1 text-xs font-medium uppercase tracking-wide text-ink-800/40">
        Confidentialité
      </p>
      {LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm text-ink-800/80 hover:bg-flame-50"
        >
          <Icon className="h-4 w-4 text-ink-800/40" />
          <span className="flex-1">{label}</span>
          <ChevronRight className="h-4 w-4 text-ink-800/20" />
        </Link>
      ))}
    </Card>
  );
}
