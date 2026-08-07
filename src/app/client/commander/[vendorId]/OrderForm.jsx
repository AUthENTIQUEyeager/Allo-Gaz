"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createOrder } from "@/lib/actions/orders";
import { formatFCFA } from "@/lib/utils";

export default function OrderForm({ vendor, availableStock, profile }) {
  const router = useRouter();
  const [stockId, setStockId] = useState(availableStock[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => availableStock.find((s) => s.id === stockId),
    [stockId, availableStock]
  );

  const total =
    (selected?.price || 0) * quantity + (deliveryMethod === "delivery" ? Number(vendor.delivery_fee || 0) : 0);

  async function handleSubmit(formData) {
    if (!selected) return;
    setLoading(true);
    setError(null);
    formData.set("vendor_id", vendor.id);
    formData.set("brand", selected.brand);
    formData.set("capacity_kg", selected.capacity_kg);
    formData.set("unit_price", selected.price);
    formData.set("delivery_fee", vendor.delivery_fee || 0);
    formData.set("quantity", quantity);
    formData.set("delivery_method", deliveryMethod);

    const result = await createOrder(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/client/commandes");
  }

  if (availableStock.length === 0) {
    return (
      <Card>
        <p className="text-sm text-ink-800/60">
          Ce vendeur n'a pas de stock disponible pour le moment.
        </p>
      </Card>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Card className="space-y-4">
        <Select label="Bouteille" value={stockId} onChange={(e) => setStockId(e.target.value)}>
          {availableStock.map((s) => (
            <option key={s.id} value={s.id}>
              {s.brand} — {s.capacity_kg}kg — {formatFCFA(s.price)}
            </option>
          ))}
        </Select>

        <Input
          label="Quantite"
          type="number"
          min={1}
          max={selected?.full_bottles || 1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <Select
          label="Reception"
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
        >
          <option value="delivery">Livraison — +{formatFCFA(vendor.delivery_fee || 0)}</option>
          <option value="pickup">Retrait sur place — gratuit</option>
        </Select>

        {deliveryMethod === "delivery" && (
          <Input
            label="Adresse de livraison"
            name="address"
            required
            defaultValue={profile?.default_address || ""}
            placeholder="Quartier, reperes..."
          />
        )}

        <Input
          label="Telephone de contact"
          name="phone"
          required
          defaultValue={profile?.phone || ""}
        />

        <Select label="Mode de paiement" name="payment_method" defaultValue="especes">
          <option value="especes">Especes a la livraison</option>
          <option value="orange_money">Orange Money</option>
          <option value="moov_money">Moov Money</option>
        </Select>
      </Card>

      <Card className="flex items-center justify-between bg-flame-50">
        <span className="text-sm font-medium text-flame-700">Total a payer</span>
        <span className="font-display text-lg font-medium text-flame-700">{formatFCFA(total)}</span>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Confirmation..." : "Confirmer la commande"}
      </Button>
    </form>
  );
}
