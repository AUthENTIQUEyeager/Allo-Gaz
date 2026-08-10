"use client";

import { Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { deleteStockItem } from "@/lib/actions/stock";
import { formatFCFA } from "@/lib/utils";
import { Boxes } from "lucide-react";

export default function StockList({ stock }) {
  if (stock.length === 0) {
    return <EmptyState icon={Boxes} title="Aucune bouteille enregistree" />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {stock.map((item) => (
        <Card key={item.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-ink-800">
              {item.brand} — {item.capacity_kg}kg
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={item.full_bottles > 3 ? "bg-green-100 text-green-700" : item.full_bottles > 0 ? "bg-ember-400/20 text-ember-600" : "bg-red-100 text-red-700"}>
                {item.full_bottles} pleines
              </Badge>
              <span className="text-xs text-ink-800/40">{formatFCFA(item.price)}</span>
            </div>
          </div>
          <form action={deleteStockItem.bind(null, item.id)}>
            <button type="submit" className="p-2 text-ink-800/30 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </Card>
      ))}
    </div>
  );
}
