"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { estimateRefillDays } from "@/lib/utils";

export async function createOrder(formData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const vendor_id = formData.get("vendor_id");
  const brand = formData.get("brand");
  const capacity_kg = Number(formData.get("capacity_kg"));
  const quantity = Number(formData.get("quantity") || 1);
  const unit_price = Number(formData.get("unit_price"));
  const delivery_method = formData.get("delivery_method");
  const delivery_fee = delivery_method === "delivery" ? Number(formData.get("delivery_fee") || 0) : 0;

  const refillDays = estimateRefillDays(capacity_kg);
  const estimated_refill_at = new Date(Date.now() + refillDays * 24 * 60 * 60 * 1000).toISOString();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      client_id: user.id,
      vendor_id,
      brand,
      capacity_kg,
      quantity,
      unit_price,
      delivery_fee,
      total_price: unit_price * quantity + delivery_fee,
      delivery_method,
      address: formData.get("address"),
      phone: formData.get("phone"),
      payment_method: formData.get("payment_method"),
      estimated_refill_at
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/client/mes-commandes");
  return { success: true, orderId: order.id };
}

export async function listClientOrders() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("orders")
    .select("*, vendors(business_name, phone)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function listVendorOrders() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, loyalty_threshold, loyalty_reward")
    .eq("profile_id", user.id)
    .single();
  if (!vendor) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });
  if (!data) return [];

  // Rang de fidelite : Nieme commande de ce client chez ce vendeur (pour la jauge cote vendeur).
  const countByClient = {};
  const chronological = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  chronological.forEach((o) => {
    countByClient[o.client_id] = (countByClient[o.client_id] || 0) + 1;
    o.clientOrderRank = countByClient[o.client_id];
  });

  return data.map((o) => ({
    ...o,
    loyaltyThreshold: vendor.loyalty_threshold,
    loyaltyReward: vendor.loyalty_reward
  }));
}

export async function getClientLoyaltyProgress(vendorId) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: vendor } = await supabase
    .from("vendors")
    .select("loyalty_threshold, loyalty_reward")
    .eq("id", vendorId)
    .single();
  if (!vendor?.loyalty_threshold) return null;

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("client_id", user.id)
    .eq("vendor_id", vendorId);

  const ordersCount = count || 0;
  const threshold = vendor.loyalty_threshold;
  const progress = ordersCount % threshold;
  const unlocked = ordersCount > 0 && progress === 0;

  return {
    threshold,
    reward: vendor.loyalty_reward,
    ordersCount,
    progress: unlocked ? threshold : progress,
    unlocked
  };
}

export async function listAllOrdersAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, vendors(business_name), profiles(full_name)")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function updateOrderStatus(orderId, status) {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) return { error: error.message };

  revalidatePath("/vendor/commandes");
  revalidatePath("/client/mes-commandes");
  revalidatePath("/admin/commandes");
  return { success: true };
}
