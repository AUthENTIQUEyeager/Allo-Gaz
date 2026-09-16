import { Gift, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import { getClientLoyaltyProgress } from "@/lib/actions/orders";

export default async function LoyaltyGauge({ vendorId }) {
  const loyalty = await getClientLoyaltyProgress(vendorId);
  if (!loyalty) return null;

  const { threshold, reward, progress, unlocked } = loyalty;
  const pct = Math.min(100, Math.round((progress / threshold) * 100));

  return (
    <Card className={unlocked ? "border-2 border-flame-400 bg-flame-50" : ""}>
      <div className="flex items-center gap-2">
        {unlocked ? (
          <Gift className="h-4 w-4 text-flame-500" />
        ) : (
          <Sparkles className="h-4 w-4 text-flame-500" />
        )}
        <p className="text-sm font-medium text-ink-800">
          {unlocked ? "Cadeau debloque !" : "Programme fidelite de ce vendeur"}
        </p>
      </div>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-flame-500 to-ember-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-ink-800/60">
        {unlocked
          ? reward
            ? `Montre cet ecran au vendeur pour recevoir : ${reward}`
            : "Montre cet ecran au vendeur pour recevoir ta recompense."
          : `${progress} / ${threshold} commandes${reward ? ` avant : ${reward}` : " avant ta recompense"}`}
      </p>
    </Card>
  );
}
