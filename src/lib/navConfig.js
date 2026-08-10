import { Home, Package, User, LayoutDashboard, Boxes, ClipboardList, Store, Users } from "lucide-react";

export const CLIENT_NAV = [
  { href: "/client", label: "Accueil", icon: Home },
  { href: "/client/commandes", label: "Commandes", icon: Package },
  { href: "/client/profil", label: "Profil", icon: User }
];

export const VENDOR_NAV = [
  { href: "/vendor", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/vendor/stock", label: "Stock", icon: Boxes },
  { href: "/vendor/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/vendor/profil", label: "Profil", icon: User }
];

export const ADMIN_NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/vendeurs", label: "Vendeurs", icon: Store },
  { href: "/admin/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users }
];
