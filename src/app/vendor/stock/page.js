import { Boxes } from "lucide-react";
import { getMyVendorProfile } from "@/lib/actions/vendors";
import EmptyState from "@/components/ui/EmptyState";
import StockForm from "./StockForm";
import StockList from "./StockList";

export default async function VendorStockPage() {
  const vendor = await getMyVendorProfile();

  if (!vendor) {
    return (
      <div className="pt-4">
        <EmptyState icon={Boxes} title="Complete d'abord ton profil vendeur" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Gestion du stock</h2>
      <StockForm />
      <StockList stock={vendor.gas_stock || []} />
    </div>
  );
}
