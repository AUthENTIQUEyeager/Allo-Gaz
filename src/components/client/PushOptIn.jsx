"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { subscribeToPush } from "@/lib/actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushOptIn() {
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      setSupported(false);
      return;
    }
    setPermission(Notification.permission);
  }, []);

  async function enable() {
    if (!VAPID_PUBLIC_KEY) return;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      await subscribeToPush(subscription.toJSON());
    } catch (err) {
      console.error("Push subscription failed", err);
    }
    setLoading(false);
  }

  if (!supported || !VAPID_PUBLIC_KEY || permission === "granted" || permission === "denied") return null;

  return (
    <Card className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flame-50 text-flame-500">
        <Bell className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink-800">Rappel quand ton gaz va finir</p>
        <p className="text-xs text-ink-800/50">On t&apos;envoie une notif juste avant, pour ne jamais tomber en panne.</p>
      </div>
      <Button className="shrink-0 text-xs" onClick={enable} disabled={loading}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BellRing className="h-3.5 w-3.5" />}
        Activer
      </Button>
    </Card>
  );
}
