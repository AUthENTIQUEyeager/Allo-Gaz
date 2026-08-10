"use client";

import BottomNav from "./BottomNav";
import { CLIENT_NAV } from "@/lib/navConfig";

export default function ClientBottomNav() {
  return <BottomNav items={CLIENT_NAV} />;
}
