"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({ profile }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        full_name: formData.get("full_name"),
        phone: formData.get("phone"),
        city: formData.get("city"),
        neighborhood: formData.get("neighborhood"),
        default_address: formData.get("default_address")
      })
      .eq("id", profile.id);
    setSaved(true);
    setLoading(false);
  }

  return (
    <form action={handleSubmit}>
      <Card className="space-y-4">
        <Input label="Nom complet" name="full_name" defaultValue={profile?.full_name || ""} />
        <Input label="Telephone" name="phone" defaultValue={profile?.phone || ""} />
        <Input label="Ville" name="city" defaultValue={profile?.city || ""} />
        <Input label="Quartier" name="neighborhood" defaultValue={profile?.neighborhood || ""} />
        <Input
          label="Adresse par defaut"
          name="default_address"
          defaultValue={profile?.default_address || ""}
        />
        {saved && <p className="text-sm text-green-600">Profil mis a jour.</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Card>
    </form>
  );
}
