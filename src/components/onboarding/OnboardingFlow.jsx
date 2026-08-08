"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, MapPin, ChevronLeft, Loader2, Check, Sparkles } from "lucide-react";
import { completeClientOnboarding, completeVendorOnboarding } from "@/lib/actions/onboarding";

const CITIES = ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya"];

function buildSteps(role) {
  const isVendor = role === "vendor";

  const steps = [
    {
      type: "welcome",
      headline: isVendor ? "Vends ton gaz sans te compliquer la vie" : "Ne souffre plus jamais du manque de gaz",
      subline: isVendor
        ? "Gere ton stock, reçois des commandes, et fais grandir ton commerce avec AlloGaz."
        : "Trouve un vendeur pres de toi, commande en 2 minutes, et fais-toi livrer."
    }
  ];

  if (isVendor) {
    steps.push(
      { type: "text", field: "business_name", question: "Le nom de ton commerce ?", placeholder: "Ex: Depot Gaz Wend-Panga" },
      { type: "text", field: "owner_name", question: "Ton nom complet ?", placeholder: "Ton nom" },
      { type: "tel", field: "phone", question: "Ton numero de telephone ?", placeholder: "+226 XX XX XX XX" },
      { type: "city", field: "city", question: "Dans quelle ville es-tu ?" },
      { type: "location", field: "location", question: "Ou se trouve ta boutique ?", hint: "Partage ta position une fois sur place, ca aide les clients a te trouver." },
      { type: "delivery_fee", field: "delivery_fee", question: "Tes frais de livraison ?" }
    );
  } else {
    steps.push(
      { type: "text", field: "full_name", question: "Comment tu t'appelles ?", placeholder: "Ton nom" },
      { type: "tel", field: "phone", question: "Ton numero de telephone ?", placeholder: "+226 XX XX XX XX" },
      { type: "city", field: "city", question: "Dans quelle ville es-tu ?" },
      { type: "location", field: "location", question: "Partage ta position", hint: "Fais-le une fois que tu es chez toi — plus besoin de taper ton adresse a chaque commande." }
    );
  }

  steps.push({ type: "done" });
  return steps;
}

export default function OnboardingFlow({ role, initialName }) {
  const router = useRouter();
  const steps = useMemo(() => buildSteps(role), [role]);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({ full_name: initialName || "", delivery_fee: 500 });
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function set(field, value) {
    setAnswers((a) => ({ ...a, [field]: value }));
  }

  function canProceed() {
    if (step.type === "text" || step.type === "tel") return Boolean(answers[step.field]?.trim());
    if (step.type === "city") return Boolean(answers.city);
    return true;
  }

  function goNext() {
    if (!canProceed()) return;
    setDirection(1);
    setError(null);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoError("La geolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        set("latitude", latitude);
        set("longitude", longitude);
        try {
          const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.neighborhood) set("neighborhood", data.neighborhood);
        } catch {
          // pas grave : on garde juste les coordonnees
        }
        setLocating(false);
      },
      () => {
        setGeoError("Impossible de recuperer ta position. Tu peux passer cette etape.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleFinish() {
    setSubmitting(true);
    setError(null);
    const action = role === "vendor" ? completeVendorOnboarding : completeClientOnboarding;
    const result = await action(answers);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    router.push(role === "vendor" ? "/vendor" : "/client");
    router.refresh();
  }

  function handleDragEnd(_, info) {
    if (step.type === "welcome" || step.type === "done") return;
    if (info.offset.x < -80 && canProceed()) goNext();
    else if (info.offset.x > 80 && stepIndex > 0) goBack();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-flame-500 via-flame-500 to-ember-500 text-white">
      {/* Progress dots */}
      <div className="flex items-center gap-2 px-6 pt-6">
        {stepIndex > 0 && (
          <button onClick={goBack} className="mr-1 rounded-full p-1.5 hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex flex-1 gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-white" : "bg-white/25"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            drag={step.type !== "welcome" && step.type !== "done" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            {step.type === "welcome" && (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/15"
                >
                  <Flame className="h-12 w-12" fill="white" strokeWidth={0} />
                </motion.div>
                <h1 className="font-display text-2xl font-medium leading-tight">{step.headline}</h1>
                <p className="mt-3 text-sm text-white/80">{step.subline}</p>
              </div>
            )}

            {(step.type === "text" || step.type === "tel") && (
              <div>
                <h2 className="mb-5 font-display text-xl font-medium">{step.question}</h2>
                <input
                  autoFocus
                  type={step.type === "tel" ? "tel" : "text"}
                  value={answers[step.field] || ""}
                  onChange={(e) => set(step.field, e.target.value)}
                  placeholder={step.placeholder}
                  className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3.5 text-base text-white placeholder-white/50 outline-none backdrop-blur focus:border-white"
                />
              </div>
            )}

            {step.type === "city" && (
              <div>
                <h2 className="mb-5 font-display text-xl font-medium">{step.question}</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => set("city", c)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                        answers.city === c
                          ? "border-white bg-white text-flame-600"
                          : "border-white/25 bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.type === "location" && (
              <div className="text-center">
                <h2 className="mb-2 font-display text-xl font-medium">{step.question}</h2>
                <p className="mb-6 text-sm text-white/75">{step.hint}</p>

                {answers.latitude ? (
                  <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
                    <Check className="h-4 w-4" /> Position enregistree{answers.neighborhood ? ` — ${answers.neighborhood}` : ""}
                  </div>
                ) : (
                  <button
                    onClick={locate}
                    disabled={locating}
                    className="mx-auto flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-flame-600 disabled:opacity-60"
                  >
                    {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    {locating ? "Localisation..." : "Partager ma position"}
                  </button>
                )}
                {geoError && <p className="mt-3 text-xs text-white/70">{geoError}</p>}
              </div>
            )}

            {step.type === "delivery_fee" && (
              <div>
                <h2 className="mb-1 font-display text-xl font-medium">{step.question}</h2>
                <p className="mb-6 text-sm text-white/75">Ce que tu factures en plus pour livrer une bouteille.</p>
                <div className="text-center">
                  <span className="font-display text-4xl font-medium">{answers.delivery_fee}</span>
                  <span className="ml-1 text-white/70">FCFA</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={100}
                  value={answers.delivery_fee}
                  onChange={(e) => set("delivery_fee", Number(e.target.value))}
                  className="mt-6 w-full accent-white"
                />
              </div>
            )}

            {step.type === "done" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/15"
                >
                  <Sparkles className="h-10 w-10" />
                </motion.div>
                <h1 className="font-display text-2xl font-medium">Tout est pret !</h1>
                <p className="mt-2 text-sm text-white/80">
                  {role === "vendor"
                    ? "Ton profil sera verifie puis active par un admin."
                    : "Tu peux commander du gaz des maintenant."}
                </p>
                {error && <p className="mt-4 text-sm text-white/90">{error}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10">
        {step.type === "done" ? (
          <button
            onClick={handleFinish}
            disabled={submitting}
            className="w-full rounded-2xl bg-white py-3.5 text-sm font-medium text-flame-600 disabled:opacity-60"
          >
            {submitting ? "Un instant..." : "C'est parti"}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="w-full rounded-2xl bg-white py-3.5 text-sm font-medium text-flame-600 disabled:opacity-40"
          >
            {isLast ? "Continuer" : "Suivant"}
          </button>
        )}
        {step.type !== "welcome" && step.type !== "done" && (
          <p className="mt-3 text-center text-xs text-white/50">Glisse aussi vers la gauche pour continuer</p>
        )}
      </div>
    </div>
  );
}
