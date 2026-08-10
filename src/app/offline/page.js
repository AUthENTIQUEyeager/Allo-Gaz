import { WifiOff, Flame } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-flame-500 to-ember-500 px-6 text-center text-white">
      <Flame className="h-8 w-8" fill="white" strokeWidth={0} />
      <WifiOff className="h-10 w-10" />
      <h1 className="font-display text-xl font-medium">Pas de connexion</h1>
      <p className="max-w-xs text-sm text-white/80">
        Verifie ta connexion internet et reessaie. Ce que tu avais deja ouvert reste accessible.
      </p>
    </div>
  );
}
