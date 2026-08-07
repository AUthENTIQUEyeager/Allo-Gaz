"use client";

import { LayoutDashboard, Boxes, ClipboardList, User } from "lucide-react";
import BottomNav from "./BottomNav";

export default function VendorBottomNav() {
  return (
    <BottomNav
      items={[
        { href: "/vendor", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/vendor/stock", label: "Stock", icon: Boxes },
        { href: "/vendor/commandes", label: "Commandes", icon: ClipboardList },
        { href: "/vendor/profil", label: "Profil", icon: User }
      ]}
    />
  );
}
