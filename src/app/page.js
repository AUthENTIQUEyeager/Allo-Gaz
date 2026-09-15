import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { listNearbyVendors } from "@/lib/actions/vendors";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicVendorGrid from "@/components/client/PublicVendorGrid";
import Card from "@/components/ui/Card";

export default async function RootPage() {
  const profile = await getCurrentProfile();

  // Utilisateur deja connecte : on le renvoie direct vers son espace.
  if (profile) {
    if (profile.role === "vendor") redirect("/vendor");
    if (profile.role === "admin") redirect("/admin");
    redirect("/client");
  }

  // Visiteur : accueil public avec les vendeurs actifs, en lecture seule.
  const vendors = await listNearbyVendors();

  return (
    <div className="min-h-screen bg-flame-50/30 pb-10">
      <PublicHeader />

      <main className="mx-auto max-w-lg px-5 py-6 md:max-w-5xl md:px-8 md:py-10">
        <Card className="bg-gradient-to-br from-flame-500 to-ember-500 text-white">
          <p className="font-display text-lg font-medium">Ton gaz, livre rapidement</p>
          <p className="mt-1 text-sm text-white/80">
            Decouvre les vendeurs de gaz butane pres de chez toi au Burkina Faso et
            inscris-toi pour commander en 2 minutes.
          </p>
        </Card>

        <div className="mt-6">
          <h2 className="mb-3 font-display text-base font-medium text-ink-800">
            Vendeurs disponibles
          </h2>
          <PublicVendorGrid vendors={vendors} />
        </div>
      </main>
    </div>
  );
}
