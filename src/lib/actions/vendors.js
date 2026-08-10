"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listNearbyVendors({ city } = {}) {
  const supabase = createClient();
  let query = supabase.from("vendors").select("*, gas_stock(*)").eq("status", "active");
  if (city) query = query.eq("city", city);
  const { data, error } = await query;
  if (error) return [];
  return data;
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
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null
  };

  const { error } = await supabase.from("vendors").upsert(payload, { onConflict: "profile_id" });
  if (error) return { error: error.message };

  revalidatePath("/vendor/profile");
  return { success: true };
}

// ---- Admin ----
export async function listVendorsForAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("vendors")
    .select("*, profiles(full_name, phone)")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function setVendorStatus(vendorId, status) {
  const supabase = createClient();
  const { error } = await supabase.from("vendors").update({ status }).eq("id", vendorId);
  if (error) return { error: error.message };
  revalidatePath("/admin/vendeurs");
  return { success: true };
}
