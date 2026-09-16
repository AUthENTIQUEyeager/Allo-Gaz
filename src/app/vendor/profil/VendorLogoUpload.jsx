"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadVendorLogo } from "@/lib/actions/vendors";

export default function VendorLogoUpload({ initialUrl }) {
  const [logoUrl, setLogoUrl] = useState(initialUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("logo", file);
    const result = await uploadVendorLogo(formData);
    if (result?.error) setError(result.error);
    else if (result?.logoUrl) setLogoUrl(result.logoUrl);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-flame-50"
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo du commerce" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-5 w-5 text-flame-400" />
        )}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </span>
        )}
      </button>
      <div>
        <p className="text-sm font-medium text-ink-800">Photo / logo du commerce</p>
        <p className="text-xs text-ink-800/50">
          Optionnel — utilisee sur la carte pour aider les clients a te reperer.
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
