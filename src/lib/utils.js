import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

// Distance a vol d'oiseau entre deux points GPS (formule de Haversine), en km
export function distanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatFCFA(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export const ORDER_STATUS_LABELS = {
  pending: "En attente",
  accepted: "Acceptee",
  delivering: "En livraison",
  completed: "Terminee",
  cancelled: "Annulee"
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-ember-400/20 text-ember-500",
  accepted: "bg-blue-100 text-blue-700",
  delivering: "bg-flame-100 text-flame-600",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};
