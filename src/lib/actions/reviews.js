"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReview(formData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecte." };

  const { error } = await supabase.from("reviews").insert({
    order_id: formData.get("order_id"),
    client_id: user.id,
    vendor_id: formData.get("vendor_id"),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment")
  });

  if (error) return { error: error.message };
  revalidatePath("/client/mes-commandes");
  return { success: true };
}
