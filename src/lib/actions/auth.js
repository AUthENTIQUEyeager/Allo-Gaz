"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ROLE_HOME = {
  client: "/client",
  vendor: "/vendor",
  admin: "/admin"
};

function checkEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return `URL=${url || "MANQUANTE"} | ANON_KEY=${key ? `presente (${key.length} caracteres)` : "MANQUANTE"}`;
  }
  return null;
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
  const envIssue = checkEnv();
  if (envIssue) return { error: `[Config manquante] ${envIssue}` };

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
      return { error: `[Supabase] ${describeError(error)}` };
    }
    if (!data?.session) {
      return {
        success: true,
        message: "Compte cree. Verifie ta boite mail pour confirmer ton adresse, puis connecte-toi."
      };
    }

    return { success: true, redirectTo: ROLE_HOME[role] };
  } catch (err) {
    return { error: `[Exception] ${describeError(err)} | raw=${String(err)}` };
  }
}

export async function signIn(formData) {
  try {
    const supabase = createClient();

    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: `[Supabase] ${error.message || JSON.stringify(error)}` };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return { error: `[Profile] ${profileError.message || JSON.stringify(profileError)}` };
    }

    return { success: true, redirectTo: ROLE_HOME[profile?.role] || "/client" };
  } catch (err) {
    return { error: `[Exception] ${err?.message || String(err)}` };
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
