"use client";

import { useEffect, useState } from "react";
import { Download, X, Flame } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || dismissed) return null;

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-ink-800 px-4 py-3 text-white shadow-card md:bottom-6 md:left-auto md:right-6 md:max-w-xs">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flame-500">
        <Flame className="h-4.5 w-4.5" fill="white" strokeWidth={0} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Installer AlloGaz</p>
        <p className="text-xs text-white/60">Acces rapide depuis ton ecran d'accueil</p>
      </div>
      <button onClick={install} className="rounded-full bg-flame-500 p-2 hover:bg-flame-600">
        <Download className="h-4 w-4" />
      </button>
      <button onClick={() => setDismissed(true)} className="p-1 text-white/40 hover:text-white/70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
