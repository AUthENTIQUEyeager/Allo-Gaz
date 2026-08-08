"use client";

import BottomNav from "./BottomNav";
import { ADMIN_NAV } from "@/lib/navConfig";

export default function AdminBottomNav() {
  return <BottomNav items={ADMIN_NAV} />;
}
