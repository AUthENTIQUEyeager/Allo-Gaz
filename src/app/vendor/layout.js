import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import DesktopTopbar from "@/components/layout/DesktopTopbar";
import VendorBottomNav from "@/components/layout/VendorBottomNav";
import Sidebar from "@/components/layout/Sidebar";
import { VENDOR_NAV } from "@/lib/navConfig";

export default async function VendorLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "vendor") redirect(profile.role === "admin" ? "/admin" : "/client");
  if (!profile.onboarding_completed) redirect("/onboarding");

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64">
      <Sidebar items={VENDOR_NAV} label="Espace vendeur" name={profile.full_name} />
      <TopHeader homeHref="/vendor" title="Espace vendeur" subtitle={profile.full_name} />
      <DesktopTopbar title="Tableau de bord" subtitle={profile.full_name} />
      <main className="mx-auto max-w-lg px-5 -mt-2 md:max-w-5xl md:px-8 md:py-8 md:mt-0">
        {children}
      </main>
      <VendorBottomNav />
    </div>
  );
}
