import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// A utiliser uniquement dans des contextes serveur de confiance (routes cron, taches planifiees).
// Contourne le RLS : ne jamais exposer cette cle ni ce client au navigateur.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
