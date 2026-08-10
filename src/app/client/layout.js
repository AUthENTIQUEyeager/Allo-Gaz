import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import DesktopTopbar from "@/components/layout/DesktopTopbar";
import ClientBottomNav from "@/components/layout/ClientBottomNav";
import Sidebar from "@/components/layout/Sidebar";

export default async function ClientLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "client") redirect(profile.role === "vendor" ? "/vendor" : "/admin");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const firstName = profile.full_name?.split(" ")[0] || "toi";

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64">
      <Sidebar role="client" name={profile.full_name} />
      <TopHeader homeHref="/client" title={`Salut, ${firstName}`} subtitle="Trouve du gaz pres de chez toi" />
      <DesktopTopbar title={`Salut, ${firstName}`} subtitle="Trouve du gaz pres de chez toi" />
      <main className="mx-auto max-w-lg px-5 -mt-2 md:max-w-5xl md:px-8 md:py-8 md:mt-0">
        {children}
      </main>
      <ClientBottomNav />
    </div>
  );
}
