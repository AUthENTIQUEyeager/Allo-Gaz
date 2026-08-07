import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

export default async function AdminLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect(profile.role === "vendor" ? "/vendor" : "/client");

  return (
    <div className="min-h-screen pb-24">
      <TopHeader homeHref="/admin" title="Administration" subtitle="Vue d'ensemble AlloGaz" />
      <main className="mx-auto max-w-lg px-5 -mt-2">{children}</main>
      <AdminBottomNav />
    </div>
  );
}
