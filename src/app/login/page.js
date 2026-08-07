"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (result?.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-flame-500 to-ember-500 px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-white">
          <Flame className="h-10 w-10" fill="white" strokeWidth={0} />
          <h1 className="mt-2 font-display text-2xl font-medium">AlloGaz</h1>
          <p className="text-sm text-white/80">Ton gaz, livre rapidement</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-medium text-ink-800">Connexion</h2>
          <form action={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" required placeholder="toi@exemple.com" />
            <Input label="Mot de passe" name="password" type="password" required placeholder="********" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-800/60">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-flame-500">
              Inscris-toi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}