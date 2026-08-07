"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { setVendorStatus } from "@/lib/actions/vendors";

const STATUS_LABEL = { pending: "En attente", active: "Actif", suspended: "Suspendu" };
const STATUS_COLOR = {
  pending: "bg-ember-400/20 text-ember-600",
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700"
};

export default function VendorRow({ vendor }) {
  const [status, setStatus] = useState(vendor.status);
  const [loading, setLoading] = useState(false);

  async function change(newStatus) {
    setLoading(true);
    const result = await setVendorStatus(vendor.id, newStatus);
    if (result?.success) setStatus(newStatus);
    setLoading(false);
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-800">{vendor.business_name}</p>
          <p className="text-xs text-ink-800/50">
            {vendor.profiles?.full_name} — {vendor.profiles?.phone}
          </p>
          <p className="text-xs text-ink-800/40">{vendor.city}</p>
        </div>
        <Badge className={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Badge>
      </div>
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
      </div>
    </Card>
  );
}
