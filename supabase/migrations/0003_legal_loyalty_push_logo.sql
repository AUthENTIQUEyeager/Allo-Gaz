-- =========================================================
-- AlloGaz — 0003 : consentement legal, logo vendeur,
-- programme de fidelite, notifications push
-- A executer dans Supabase > SQL Editor (une seule fois)
-- =========================================================

-- ---------- CONSENTEMENT LEGAL (CGU / confidentialite / cookies) ----------
alter table public.profiles add column if not exists legal_consent_at timestamptz;

-- Mise a jour du trigger de creation de profil pour capturer le consentement
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone, city, legal_consent_at)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    (new.raw_user_meta_data->>'legal_consent_at')::timestamptz
  );
  return new;
end;
$$ language plpgsql security definer;

-- ---------- PHOTO / LOGO VENDEUR ----------
alter table public.vendors add column if not exists logo_url text;

-- ---------- PROGRAMME DE FIDELITE (defini par le vendeur) ----------
alter table public.vendors add column if not exists loyalty_threshold integer;
alter table public.vendors add column if not exists loyalty_reward text;

-- ---------- RAPPEL DE REAPPROVISIONNEMENT ----------
alter table public.orders add column if not exists estimated_refill_at timestamptz;
alter table public.orders add column if not exists refill_reminder_sent boolean not null default false;

-- ---------- ABONNEMENTS PUSH ----------
create table if not exists public.push_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_own" on public.push_subscriptions;
create policy "push_subscriptions_own" on public.push_subscriptions
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- STOCKAGE : PHOTOS / LOGOS VENDEURS ----------
insert into storage.buckets (id, name, public)
values ('vendor-logos', 'vendor-logos', true)
on conflict (id) do nothing;

drop policy if exists "vendor_logos_public_read" on storage.objects;
create policy "vendor_logos_public_read" on storage.objects
  for select using (bucket_id = 'vendor-logos');

drop policy if exists "vendor_logos_owner_write" on storage.objects;
create policy "vendor_logos_owner_write" on storage.objects
  for insert with check (bucket_id = 'vendor-logos' and auth.role() = 'authenticated');

drop policy if exists "vendor_logos_owner_update" on storage.objects;
create policy "vendor_logos_owner_update" on storage.objects
  for update using (bucket_id = 'vendor-logos' and auth.role() = 'authenticated');

drop policy if exists "vendor_logos_owner_delete" on storage.objects;
create policy "vendor_logos_owner_delete" on storage.objects
  for delete using (bucket_id = 'vendor-logos' and auth.role() = 'authenticated');
