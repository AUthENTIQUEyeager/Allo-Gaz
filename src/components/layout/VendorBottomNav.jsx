"use client";

import BottomNav from "./BottomNav";
import { VENDOR_NAV } from "@/lib/navConfig";

export default function VendorBottomNav() {
  return <BottomNav items={VENDOR_NAV} />;
}
