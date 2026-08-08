import { Store } from "lucide-react";
import { listVendorsForAdmin } from "@/lib/actions/vendors";
import EmptyState from "@/components/ui/EmptyState";
import VendorRow from "./VendorRow";

export default async function AdminVendorsPage() {
  const vendors = await listVendorsForAdmin();

  return (
    <div className="space-y-3 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Gestion des vendeurs</h2>
      {vendors.length === 0 ? (
        <EmptyState icon={Store} title="Aucun vendeur inscrit" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {vendors.map((v) => (
            <VendorRow key={v.id} vendor={v} />
          ))}
        </div>
      )}
    </div>
  );
}
