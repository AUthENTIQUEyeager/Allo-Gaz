import { getMyVendorProfile } from "@/lib/actions/vendors";
import VendorProfileForm from "./VendorProfileForm";

export default async function VendorProfilePage() {
  const vendor = await getMyVendorProfile();

  return (
    <div className="space-y-4 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Profil de mon commerce</h2>
      <VendorProfileForm vendor={vendor} />
    </div>
  );
}
