"use client";

import { useState } from "react";
import { Phone, MapPin, Package, ShoppingBag, Star, Clock, ExternalLink } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { setVendorStatus } from "@/lib/actions/vendors";
import { formatFCFA, totalStock } from "@/lib/utils";

const STATUS_LABEL = { pending: "En attente", active: "Actif", suspended: "Suspendu" };
const STATUS_COLOR = {
  pending: "bg-ember-400/20 text-ember-600",
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700"
};

export default function VendorRow({ vendor }) {
  const [status, setStatus] = useState(vendor.status);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function change(newStatus) {
    setLoading(true);
    const result = await setVendorStatus(vendor.id, newStatus);
    if (result?.success) setStatus(newStatus);
    setLoading(false);
  }

  const stock = totalStock(vendor);
  const mapsUrl =
    vendor.latitude && vendor.longitude
      ? `https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}`
      : null;

  return (
    <>
      <Card>
        <button type="button" className="block w-full text-left" onClick={() => setShowDetails(true)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-ink-800">{vendor.business_name}</p>
              <p className="text-xs text-ink-800/50">
                {vendor.profiles?.full_name} — {vendor.profiles?.phone}
              </p>
              <p className="text-xs text-ink-800/40">
                {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}
                {vendor.city}
              </p>
            </div>
            <Badge className={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge className="bg-flame-50 text-flame-600">
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" /> {stock} bouteilles en stock
              </span>
            </Badge>
            <Badge className="bg-cyan-50 text-cyan-700">
              <span className="flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> {vendor.ordersToday} commande
                {vendor.ordersToday > 1 ? "s" : ""} aujourd&apos;hui
              </span>
            </Badge>
          </div>
        </button>

        <div className="mt-3 flex gap-2 border-t border-black/5 pt-3">
          {status !== "active" && (
            <Button className="text-xs" disabled={loading} onClick={() => change("active")}>
              Activer
            </Button>
          )}
          {status !== "suspended" && (
            <Button
              variant="outline"
              className="text-xs"
              disabled={loading}
              onClick={() => change("suspended")}
            >
              Suspendre
            </Button>
          )}
          <Button variant="ghost" className="ml-auto text-xs" onClick={() => setShowDetails(true)}>
            Voir plus
          </Button>
        </div>
      </Card>

      {showDetails && (
        <Modal onClose={() => setShowDetails(false)}>
          <p className="font-display text-base font-medium text-ink-800">{vendor.business_name}</p>
          <Badge className={`mt-1.5 inline-block ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</Badge>

          <div className="mt-4 space-y-2.5 text-sm text-ink-800/80">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-ink-800/40" />
              {vendor.phone} <span className="text-ink-800/40">(commerce)</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-ink-800/40" />
              {vendor.profiles?.phone || "—"}{" "}
              <span className="text-ink-800/40">({vendor.profiles?.full_name || "proprietaire"})</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ink-800/40" />
              {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}
              {vendor.city}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-flame-500 hover:underline"
                >
                  Voir sur la carte <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>
            {vendor.opening_hours && (
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-800/40" />
                {vendor.opening_hours}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Star className="h-4 w-4 text-ink-800/40" />
              {vendor.rating > 0 ? `${vendor.rating} / 5 (${vendor.rating_count} avis)` : "Pas encore note"}
            </p>
          </div>

          <div className="mt-4 border-t border-black/5 pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-800/40">
              Stock ({stock} bouteilles pleines au total)
            </p>
            {vendor.gas_stock?.length > 0 ? (
              <div className="space-y-1.5">
                {vendor.gas_stock.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-flame-50/60 px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-ink-800">
                      {s.brand} {s.capacity_kg}kg
                    </span>
                    <span className="text-ink-800/60">
                      {s.full_bottles} pleines · {s.empty_bottles} vides · {formatFCFA(s.price)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-800/40">Aucun produit enregistre.</p>
            )}
          </div>

          <div className="mt-4 border-t border-black/5 pt-4">
            <p className="flex items-center gap-2 text-sm text-ink-800/80">
              <ShoppingBag className="h-4 w-4 text-ink-800/40" />
              {vendor.ordersToday} commande{vendor.ordersToday > 1 ? "s" : ""} aujourd&apos;hui
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
