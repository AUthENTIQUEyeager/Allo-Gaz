"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { upsertStockItem } from "@/lib/actions/stock";

const BRANDS = ["Total", "Oryx", "Shell", "Winstar", "SODIGAZ", "Autre"];
const CAPACITIES = [3, 6, 12, 25];

export default function StockForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    const result = await upsertStockItem(formData);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-ink-800">Ajouter / mettre a jour une bouteille</p>
      <form action={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Marque" name="brand" defaultValue="Total">
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select label="Capacite" name="capacity_kg" defaultValue="12">
            {CAPACITIES.map((c) => (
              <option key={c} value={c}>
                {c} kg
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Bouteilles pleines" name="full_bottles" type="number" min={0} defaultValue={0} />
          <Input label="Bouteilles vides" name="empty_bottles" type="number" min={0} defaultValue={0} />
        </div>
        <Input label="Prix (FCFA)" name="price" type="number" min={0} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Card>
  );
}
