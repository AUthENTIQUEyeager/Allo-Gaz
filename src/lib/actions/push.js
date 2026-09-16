"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToPush(subscription) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      profile_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    },
    { onConflict: "endpoint" }
  );
  if (error) return { error: error.message };
  return { success: true };
}

export async function unsubscribeFromPush(endpoint) {
  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) return { error: error.message };
  return { success: true };
}
