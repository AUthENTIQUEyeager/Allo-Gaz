"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ROLE_HOME = {
  client: "/client",
  vendor: "/vendor",
  admin: "/admin"
};

function envSnapshot() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return {
    ok: Boolean(url && key),
    url: url || "MANQUANTE",
    keyInfo: key ? `presente (${key.length} caracteres)` : "MANQUANTE"
  };
}

function describeError(error) {
  return JSON.stringify({
    message: error?.message,
    name: error?.name,
    status: error?.status,
    code: error?.code,
    cause: error?.cause?.message || error?.cause
  });
}

export async function signUp(formData) {
  const env = envSnapshot();
  if (!env.ok) {
    return { error: `[Config manquante] URL=${env.url} | ANON_KEY=${env.keyInfo}` };
  }

  try {
    const supabase = createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const full_name = formData.get("full_name");
    const phone = formData.get("phone");
    const city = formData.get("city");
    const role = formData.get("role") === "vendor" ? "vendor" : "client";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone, city, role }
      }
    });

    if (error) {
      return { error: `[URL:${env.url}] [Supabase] ${describeError(error)}` };
    }
    if (!data?.session) {
      return {
        success: true,
        message: "Compte cree. Verifie ta boite mail pour confirmer ton adresse, puis connecte-toi."
      };
    }

    return { success: true, redirectTo: ROLE_HOME[role] };
  } catch (err) {
    return { error: `[URL:${env.url}] [Exception] ${describeError(err)} | raw=${String(err)}` };
  }
}

export async function signIn(formData) {
  const env = envSnapshot();
  if (!env.ok) {
    return { error: `[Config manquante] URL=${env.url} | ANON_KEY=${env.keyInfo}` };
  }

  try {
    const supabase = createClient();

    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: `[URL:${env.url}] [Supabase] ${describeError(error)}` };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return { error: `[URL:${env.url}] [Profile] ${describeError(profileError)}` };
    }

    return { success: true, redirectTo: ROLE_HOME[profile?.role] || "/client" };
  } catch (err) {
    return { error: `[URL:${env.url}] [Exception] ${describeError(err)} | raw=${String(err)}` };
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
