"use client";

import { LayoutDashboard, Store, Users, ClipboardList } from "lucide-react";
import BottomNav from "./BottomNav";

export default function AdminBottomNav() {
  return (
    <BottomNav
      items={[
        { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/admin/vendeurs", label: "Vendeurs", icon: Store },
        { href: "/admin/commandes", label: "Commandes", icon: ClipboardList },
        { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users }
      ]}
    />
  );
}
