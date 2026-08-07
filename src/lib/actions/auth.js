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
      return { error: `[Supabase] ${error.message || JSON.stringify(error)}` };
    }
    if (!data?.session) {
      return {
        success: true,
        message: "Compte cree. Verifie ta boite mail pour confirmer ton adresse, puis connecte-toi."
      };
    }

    return { success: true, redirectTo: ROLE_HOME[role] };
  } catch (err) {
    return { error: `[Exception] ${err?.message || String(err)}` };
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
