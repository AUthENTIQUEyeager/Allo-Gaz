import { notFound } from "next/navigation";
import { getVendorById } from "@/lib/actions/vendors";
import { getCurrentProfile } from "@/lib/supabase/server";
import OrderForm from "./OrderForm";

export default async function OrderPage({ params }) {
  const vendor = await getVendorById(params.vendorId);
  const profile = await getCurrentProfile();
  if (!vendor) notFound();

  const availableStock = (vendor.gas_stock || []).filter((s) => s.full_bottles > 0);

  return (
    <div className="space-y-4 pt-4">
      <div>
        <h2 className="font-display text-lg font-medium text-ink-800">{vendor.business_name}</h2>
        <p className="text-sm text-ink-800/50">{vendor.neighborhood || vendor.city}</p>
      </div>
      <OrderForm vendor={vendor} availableStock={availableStock} profile={profile} />
    </div>
  );
}
