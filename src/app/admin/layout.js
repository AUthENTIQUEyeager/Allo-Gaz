import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import DesktopTopbar from "@/components/layout/DesktopTopbar";
import AdminBottomNav from "@/components/layout/AdminBottomNav";
import Sidebar from "@/components/layout/Sidebar";

export default async function AdminLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect(profile.role === "vendor" ? "/vendor" : "/client");

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64">
      <Sidebar role="admin" name={profile.full_name} />
      <TopHeader homeHref="/admin" title="Administration" subtitle="Vue d'ensemble AlloGaz" />
      <DesktopTopbar title="Administration" subtitle="Vue d'ensemble AlloGaz" />
      <main className="mx-auto max-w-lg px-5 -mt-2 md:max-w-5xl md:px-8 md:py-8 md:mt-0">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  );
}
