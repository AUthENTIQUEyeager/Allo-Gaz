"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
      payment_method: formData.get("payment_method")
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
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!vendor) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });
  return data || [];
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
