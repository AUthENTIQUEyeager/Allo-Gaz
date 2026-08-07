"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertStockItem(formData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!vendor) return { error: "Profil vendeur introuvable." };

  const payload = {
    vendor_id: vendor.id,
    brand: formData.get("brand"),
    capacity_kg: Number(formData.get("capacity_kg")),
    full_bottles: Number(formData.get("full_bottles") || 0),
    empty_bottles: Number(formData.get("empty_bottles") || 0),
    price: Number(formData.get("price")),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("gas_stock")
    .upsert(payload, { onConflict: "vendor_id,brand,capacity_kg" });

  if (error) return { error: error.message };
  revalidatePath("/vendor/stock");
  return { success: true };
}

export async function deleteStockItem(stockId) {
  const supabase = createClient();
  const { error } = await supabase.from("gas_stock").delete().eq("id", stockId);
  if (error) return { error: error.message };
  revalidatePath("/vendor/stock");
  return { success: true };
}
