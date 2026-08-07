import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

const ROLE_COLOR = {
  client: "bg-blue-100 text-blue-700",
  vendor: "bg-flame-100 text-flame-600",
  admin: "bg-ink-800 text-white"
};

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-3 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Utilisateurs</h2>
      {!users || users.length === 0 ? (
        <EmptyState icon={Users} title="Aucun utilisateur" />
      ) : (
        users.map((u) => (
          <Card key={u.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-ink-800">{u.full_name || "Sans nom"}</p>
              <p className="text-xs text-ink-800/50">{u.phone} — {u.city}</p>
            </div>
            <Badge className={ROLE_COLOR[u.role]}>{u.role}</Badge>
          </Card>
        ))
      )}
    </div>
  );
}
