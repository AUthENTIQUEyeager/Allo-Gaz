"use client";

import { Home, Package, User, Flame } from "lucide-react";
import BottomNav from "./BottomNav";

export default function ClientBottomNav() {
  return (
    <BottomNav
      items={[
        { href: "/client", label: "Accueil", icon: Home },
        { href: "/client/commandes", label: "Commandes", icon: Package },
        { href: "/client/profil", label: "Profil", icon: User }
      ]}
    />
  );
}
