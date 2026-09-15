"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ onClose, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 backdrop-blur-sm md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-card md:rounded-3xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-ink-800/40 hover:bg-flame-50"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
