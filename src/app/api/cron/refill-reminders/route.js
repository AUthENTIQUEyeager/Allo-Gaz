import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REMINDER_WINDOW_HOURS = 48; // On previent ~2 jours avant la fin estimee de la bouteille

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    return NextResponse.json({ error: "Cles VAPID manquantes" }, { status: 500 });
  }

  webpush.setVapidDetails(
    "mailto:authentique.studio.web@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const supabase = createAdminClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 60 * 60 * 1000);

  const { data: dueOrders, error } = await supabase
    .from("orders")
    .select("id, client_id, brand, capacity_kg")
    .eq("refill_reminder_sent", false)
    .not("status", "eq", "cancelled")
    .lte("estimated_refill_at", windowEnd.toISOString())
    .gte("estimated_refill_at", now.toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!dueOrders || dueOrders.length === 0) {
    return NextResponse.json({ sent: 0, message: "Aucun rappel a envoyer" });
  }

  let sent = 0;
  let failed = 0;

  for (const order of dueOrders) {
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("profile_id", order.client_id);

    if (!subscriptions || subscriptions.length === 0) continue;

    const payload = JSON.stringify({
      title: "Ton gaz va bientot finir",
      body: `Ta bouteille ${order.brand} ${order.capacity_kg}kg devrait bientot etre vide. Recommande en 2 minutes.`,
      url: "/client"
    });

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        // Abonnement expire ou invalide : on le supprime pour ne pas reessayer indefiniment.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
      }
    }

    await supabase.from("orders").update({ refill_reminder_sent: true }).eq("id", order.id);
  }

  return NextResponse.json({ sent, failed, ordersProcessed: dueOrders.length });
}
