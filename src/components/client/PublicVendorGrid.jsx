"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Lock, UserPlus, LogIn } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import VendorAvatar from "@/components/client/VendorAvatar";
import { formatFCFA } from "@/lib/utils";

export default function PublicVendorGrid({ vendors }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (vendors.length === 0) {
    return (
      <EmptyState
        title="Aucun vendeur actif pour l'instant"
        description="Reviens bientot, de nouveaux vendeurs rejoignent AlloGaz regulierement."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor, i) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
          >
            <button
              type="button"
              onClick={() => setShowAuthPrompt(true)}
              className="block w-full text-left"
            >
              <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <VendorAvatar logoUrl={vendor.logo_url} name={vendor.business_name} />
                    <div>
                      <p className="font-display text-sm font-medium text-ink-800">
                        {vendor.business_name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-800/50">
                        <MapPin className="h-3 w-3" /> {vendor.neighborhood || vendor.city}
                      </p>
                    </div>
                  </div>
                  {vendor.rating > 0 && (
                    <Badge className="bg-ember-400/20 text-ember-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {vendor.rating}
                      </span>
                    </Badge>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vendor.gas_stock
                    ?.filter((s) => s.full_bottles > 0)
                    .slice(0, 4)
                    .map((s) => (
                      <Badge key={s.id} className="bg-flame-50 text-flame-600">
                        {s.brand} {s.capacity_kg}kg — {formatFCFA(s.price)}
                      </Badge>
                    ))}
                  {(!vendor.gas_stock || vendor.gas_stock.every((s) => s.full_bottles === 0)) && (
                    <Badge className="bg-red-50 text-red-600">Stock epuise</Badge>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-ink-800/40">
                  <Lock className="h-3 w-3" /> Inscris-toi pour commander
                </div>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAuthPrompt && (
          <Modal onClose={() => setShowAuthPrompt(false)}>
            <p className="font-display text-base font-medium text-ink-800">Rejoins AlloGaz</p>
            <p className="mt-1.5 text-sm text-ink-800/60">
              Cree un compte ou connecte-toi pour commander du gaz aupres de ce vendeur.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link href="/register" className="w-full">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4" /> S&apos;inscrire
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <LogIn className="h-4 w-4" /> Se connecter
                </Button>
              </Link>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
