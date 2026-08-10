import { getCurrentProfile } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ClientProfilePage() {
  const profile = await getCurrentProfile();
  return (
    <div className="space-y-4 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Mon profil</h2>
      <ProfileForm profile={profile} />
    </div>
  );
}
