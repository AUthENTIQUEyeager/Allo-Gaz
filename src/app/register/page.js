"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { signUp } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (result?.message) {
      setMessage(result.message);
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
          <p className="text-sm text-white/80">Cree ton compte en 10 secondes</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          {message ? (
            <div className="text-center">
              <p className="text-sm text-ink-800">{message}</p>
              <Link href="/login" className="mt-4 inline-block text-sm font-medium text-flame-500">
                Aller a la connexion
              </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <Select label="Je suis..." name="role" defaultValue="client">
                <option value="client">Client — je veux commander du gaz</option>
                <option value="vendor">Vendeur — je veux vendre du gaz</option>
              </Select>
              <Input label="Email" name="email" type="email" required placeholder="toi@exemple.com" />
              <Input label="Mot de passe" name="password" type="password" required minLength={6} placeholder="6 caracteres minimum" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creation..." : "Creer mon compte"}
              </Button>
              <p className="text-center text-xs text-ink-800/40">
                Le reste (nom, ville, position...) se fait juste apres, etape par etape.
              </p>
            </form>
          )}
          {!message && (
            <p className="mt-4 text-center text-sm text-ink-800/60">
              Deja un compte ?{" "}
              <Link href="/login" className="font-medium text-flame-500">
                Connecte-toi
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
