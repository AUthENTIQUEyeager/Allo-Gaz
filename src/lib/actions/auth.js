"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ROLE_HOME = {
  client: "/client",
  vendor: "/vendor",
  admin: "/admin"
};

export async function signUp(formData) {
  try {
    const supabase = createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role") === "vendor" ? "vendor" : "client";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });

    if (error) return { error: error.message };
    if (!data?.session) {
      return {
        success: true,
        message: "Compte cree. Verifie ta boite mail pour confirmer ton adresse, puis connecte-toi."
      };
    }

    return { success: true, redirectTo: "/onboarding" };
  } catch (err) {
    return { error: err?.message || "Une erreur est survenue. Reessaie." };
  }
}

export async function signIn(formData) {
  try {
    const supabase = createClient();

    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: "Email ou mot de passe incorrect." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", data.user.id)
      .single();

    if (!profile?.onboarding_completed) {
      return { success: true, redirectTo: "/onboarding" };
    }

    return { success: true, redirectTo: ROLE_HOME[profile?.role] || "/client" };
  } catch (err) {
    return { error: err?.message || "Une erreur est survenue. Reessaie." };
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
