import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import VendorBottomNav from "@/components/layout/VendorBottomNav";

export default async function VendorLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "vendor") redirect(profile.role === "admin" ? "/admin" : "/client");

  return (
    <div className="min-h-screen pb-24">
      <TopHeader homeHref="/vendor" title="Espace vendeur" subtitle={profile.full_name} />
      <main className="mx-auto max-w-lg px-5 -mt-2">{children}</main>
      <VendorBottomNav />
    </div>
  );
}
