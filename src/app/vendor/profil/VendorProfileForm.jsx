"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { upsertVendorProfile } from "@/lib/actions/vendors";
import VendorLogoUpload from "./VendorLogoUpload";

export default function VendorProfileForm({ vendor }) {
  const [coords, setCoords] = useState({
    latitude: vendor?.latitude || "",
    longitude: vendor?.longitude || ""
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });
  }

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    formData.set("latitude", coords.latitude);
    formData.set("longitude", coords.longitude);
    const result = await upsertVendorProfile(formData);
    if (result?.error) setError(result.error);
    else setSaved(true);
    setLoading(false);
  }

  return (
    <form action={handleSubmit}>
      <Card className="space-y-4">
        <VendorLogoUpload initialUrl={vendor?.logo_url} />
        <Input label="Nom du commerce" name="business_name" required defaultValue={vendor?.business_name || ""} />
        <Input label="Telephone" name="phone" required defaultValue={vendor?.phone || ""} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Ville" name="city" required defaultValue={vendor?.city || ""} />
          <Input label="Quartier" name="neighborhood" defaultValue={vendor?.neighborhood || ""} />
        </div>
        <Input label="Horaires" name="opening_hours" placeholder="7h - 20h, tous les jours" defaultValue={vendor?.opening_hours || ""} />
        <Input label="Frais de livraison (FCFA)" name="delivery_fee" type="number" min={0} defaultValue={vendor?.delivery_fee || 0} />

        <div className="space-y-3 rounded-2xl bg-flame-50/60 p-3.5">
          <p className="text-sm font-medium text-ink-800">Programme fidelite (optionnel)</p>
          <p className="text-xs text-ink-800/50">
            Recompense un client apres X commandes chez toi. Choisis le seuil et la recompense — tu
            geres la remise toi-meme, en personne, quand le client te montre l&apos;ecran debloque.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Apres combien de commandes ?"
              name="loyalty_threshold"
              type="number"
              min={1}
              placeholder="ex: 5"
              defaultValue={vendor?.loyalty_threshold || ""}
            />
            <Input
              label="Recompense"
              name="loyalty_reward"
              placeholder="ex: livraison offerte"
              defaultValue={vendor?.loyalty_reward || ""}
            />
          </div>
        </div>

        <div>
          <button type="button" onClick={locate} className="flex items-center gap-1.5 text-sm font-medium text-flame-500">
            <MapPin className="h-4 w-4" /> Utiliser ma position actuelle
          </button>
          {coords.latitude && (
            <p className="mt-1 text-xs text-ink-800/40">
              {Number(coords.latitude).toFixed(4)}, {Number(coords.longitude).toFixed(4)}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Profil enregistre.</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Card>
    </form>
  );
}
