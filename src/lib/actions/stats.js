"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClientStats() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("total_price, status, vendor_id, vendors(business_name)")
    .eq("client_id", user.id);

  if (!orders) return { totalOrders: 0, totalSpent: 0, favoriteVendor: null };

  const completed = orders.filter((o) => o.status === "completed");
  const totalSpent = completed.reduce((sum, o) => sum + Number(o.total_price), 0);

  const counts = {};
  orders.forEach((o) => {
    const name = o.vendors?.business_name;
    if (!name) return;
    counts[name] = (counts[name] || 0) + 1;
  });
  const favoriteVendor = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return { totalOrders: orders.length, totalSpent, favoriteVendor };
}

export async function getVendorStats() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!vendor) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("total_price, status, created_at")
    .eq("vendor_id", vendor.id);

  if (!orders) return { last7Days: [], totalOrders: 0, totalRevenue: 0, completionRate: 0 };

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
    const dayOrders = orders.filter((o) => o.created_at.slice(0, 10) === key);
    days.push({
      label,
      commandes: dayOrders.length,
      revenu: dayOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + Number(o.total_price), 0)
    });
  }

  const completed = orders.filter((o) => o.status === "completed");
  const cancelled = orders.filter((o) => o.status === "cancelled");
  const completionRate = orders.length
    ? Math.round((completed.length / (orders.length - 0)) * 100)
    : 0;

  return {
    last7Days: days,
    totalOrders: orders.length,
    totalRevenue: completed.reduce((sum, o) => sum + Number(o.total_price), 0),
    completionRate,
    cancelledCount: cancelled.length
  };
}
