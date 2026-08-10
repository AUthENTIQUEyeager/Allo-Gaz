"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeClientOnboarding(payload) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: payload.full_name,
      phone: payload.phone,
      city: payload.city,
      neighborhood: payload.neighborhood || null,
      default_address: payload.neighborhood ? `${payload.neighborhood}, ${payload.city}` : null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      onboarding_completed: true
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/client");
  return { success: true };
}

export async function completeVendorOnboarding(payload) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: payload.owner_name,
      phone: payload.phone,
      city: payload.city,
      neighborhood: payload.neighborhood || null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      onboarding_completed: true
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const { error: vendorError } = await supabase.from("vendors").upsert(
    {
      profile_id: user.id,
      business_name: payload.business_name,
      phone: payload.phone,
      city: payload.city,
      neighborhood: payload.neighborhood || null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      delivery_fee: payload.delivery_fee ?? 0
    },
    { onConflict: "profile_id" }
  );

  if (vendorError) return { error: vendorError.message };
  revalidatePath("/vendor");
  return { success: true };
}
