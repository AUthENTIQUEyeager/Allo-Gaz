"use client";

import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatFCFA, totalStock } from "@/lib/utils";

const STATUS_LABEL = { pending: "En attente", active: "Actif", suspended: "Suspendu" };

function buildMarkdown(vendors) {
  const date = new Date().toLocaleString("fr-FR");
  let md = `# Export vendeurs AlloGaz\n\nGenere le ${date} — ${vendors.length} vendeur(s)\n\n---\n\n`;

  vendors.forEach((v) => {
    md += `## ${v.business_name}\n\n`;
    md += `- **Statut** : ${STATUS_LABEL[v.status] || v.status}\n`;
    md += `- **Proprietaire** : ${v.profiles?.full_name || "—"} (${v.profiles?.phone || "—"})\n`;
    md += `- **Telephone commerce** : ${v.phone}\n`;
    md += `- **Localisation** : ${v.neighborhood ? `${v.neighborhood}, ` : ""}${v.city}`;
    md += v.latitude && v.longitude ? ` (${v.latitude}, ${v.longitude})\n` : "\n";
    if (v.opening_hours) md += `- **Horaires** : ${v.opening_hours}\n`;
    md += `- **Frais de livraison** : ${formatFCFA(v.delivery_fee || 0)}\n`;
    md += `- **Note** : ${v.rating > 0 ? `${v.rating}/5 (${v.rating_count} avis)` : "Pas encore note"}\n`;
    md += `- **Commandes aujourd'hui** : ${v.ordersToday}\n`;
    md += `- **Stock total** : ${totalStock(v)} bouteilles pleines\n`;

    if (v.gas_stock?.length > 0) {
      md += `\n| Produit | Pleines | Vides | Prix |\n|---|---|---|---|\n`;
      v.gas_stock.forEach((s) => {
        md += `| ${s.brand} ${s.capacity_kg}kg | ${s.full_bottles} | ${s.empty_bottles} | ${formatFCFA(s.price)} |\n`;
      });
    }
    md += `\n---\n\n`;
  });

  return md;
}

export default function DownloadVendorsButton({ vendors }) {
  function handleDownload() {
    const markdown = buildMarkdown(vendors);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `allogaz-vendeurs-${dateStamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" className="text-xs" onClick={handleDownload}>
      <Download className="h-3.5 w-3.5" /> Telecharger (.md)
    </Button>
  );
}
