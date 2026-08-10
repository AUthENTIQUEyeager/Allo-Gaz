import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.onboarding_completed) {
    redirect(profile.role === "vendor" ? "/vendor" : profile.role === "admin" ? "/admin" : "/client");
  }

  return <OnboardingFlow role={profile.role} initialName={profile.full_name} />;
}
