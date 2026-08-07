import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import TopHeader from "@/components/layout/TopHeader";
import ClientBottomNav from "@/components/layout/ClientBottomNav";

export default async function ClientLayout({ children }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "client") redirect(profile.role === "vendor" ? "/vendor" : "/admin");

  return (
    <div className="min-h-screen pb-24">
      <TopHeader
        homeHref="/client"
        title={`Salut, ${profile.full_name?.split(" ")[0] || "toi"}`}
        subtitle="Trouve du gaz pres de chez toi"
      />
      <main className="mx-auto max-w-lg px-5 -mt-2">{children}</main>
      <ClientBottomNav />
    </div>
  );
}
