"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { totalStock } from "@/lib/utils";

export async function listNearbyVendors({ city } = {}) {
  const supabase = createClient();
  let query = supabase.from("vendors").select("*, gas_stock(*)").eq("status", "active");
  if (city) query = query.eq("city", city);
  const { data, error } = await query;
  if (error) return [];
  // Les vendeurs avec le plus de bouteilles pleines disponibles apparaissent en premier.
  return [...data].sort((a, b) => totalStock(b) - totalStock(a));
}

export async function getVendorById(vendorId) {
  const supabase = createClient();
  const { data } = await supabase
    .from("vendors")
    .select("*, gas_stock(*)")
    .eq("id", vendorId)
    .single();
  return data;
}

export async function getMyVendorProfile() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("vendors")
    .select("*, gas_stock(*)")
    .eq("profile_id", user.id)
    .maybeSingle();
  return data;
}

export async function upsertVendorProfile(formData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const payload = {
    profile_id: user.id,
    business_name: formData.get("business_name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    neighborhood: formData.get("neighborhood"),
    opening_hours: formData.get("opening_hours"),
    delivery_fee: Number(formData.get("delivery_fee") || 0),
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    loyalty_threshold: formData.get("loyalty_threshold") ? Number(formData.get("loyalty_threshold")) : null,
    loyalty_reward: formData.get("loyalty_reward") || null
  };

  const { error } = await supabase.from("vendors").upsert(payload, { onConflict: "profile_id" });
  if (error) return { error: error.message };

  revalidatePath("/vendor/profile");
  return { success: true };
}

// Upload de la photo/logo du commerce, utilisee ensuite comme marqueur sur la carte.
export async function uploadVendorLogo(formData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const file = formData.get("logo");
  if (!file || typeof file === "string" || file.size === 0) return { error: "Aucun fichier." };
  if (file.size > 3 * 1024 * 1024) return { error: "Image trop lourde (max 3 Mo)." };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("vendor-logos")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (uploadError) return { error: uploadError.message };

  const { data: publicUrlData } = supabase.storage.from("vendor-logos").getPublicUrl(path);
  const logoUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("vendors")
    .update({ logo_url: logoUrl })
    .eq("profile_id", user.id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/vendor/profile");
  return { success: true, logoUrl };
}

// ---- Admin ----
export async function listVendorsForAdmin() {
  const supabase = createClient();
  const { data: vendors } = await supabase
    .from("vendors")
    .select("*, profiles(full_name, phone), gas_stock(*)")
    .order("created_at", { ascending: false });
  if (!vendors) return [];

  // Commandes du jour, groupees par vendeur, pour affichage dans le panneau admin.
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("vendor_id")
    .gte("created_at", startOfDay.toISOString());

  const ordersTodayByVendor = {};
  (todayOrders || []).forEach((o) => {
    ordersTodayByVendor[o.vendor_id] = (ordersTodayByVendor[o.vendor_id] || 0) + 1;
  });

  return vendors.map((v) => ({
    ...v,
    ordersToday: ordersTodayByVendor[v.id] || 0
  }));
}

export async function setVendorStatus(vendorId, status) {
  const supabase = createClient();
  const { error } = await supabase.from("vendors").update({ status }).eq("id", vendorId);
  if (error) return { error: error.message };
  revalidatePath("/admin/vendeurs");
  return { success: true };
}
