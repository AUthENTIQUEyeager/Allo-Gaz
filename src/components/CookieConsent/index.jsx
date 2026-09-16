"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import Button from "@/components/ui/Button";
import GoogleAnalytics from "./GoogleAnalytics";

const CONSENT_KEY = "allogaz_cookie_consent"; // "accepted" | "refused"
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CONSENT_KEY);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(undefined); // undefined = pas encore lu

  useEffect(() => {
    setConsent(window.localStorage.getItem(CONSENT_KEY));
  }, []);

  function choose(value) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}

      {consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white p-4 shadow-card md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl md:border">
          <div className="flex items-start gap-2.5">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-flame-500" />
            <div>
              <p className="text-sm text-ink-800">
                On utilise des cookies essentiels au fonctionnement de l&apos;app, et (avec ton accord)
                des cookies de mesure d&apos;audience.{" "}
                <Link href="/legal/cookies" className="font-medium text-flame-500 hover:underline">
                  En savoir plus
                </Link>
              </p>
              <div className="mt-3 flex gap-2">
                <Button className="text-xs" onClick={() => choose("accepted")}>
                  Accepter
                </Button>
                <Button variant="outline" className="text-xs" onClick={() => choose("refused")}>
                  Refuser
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
