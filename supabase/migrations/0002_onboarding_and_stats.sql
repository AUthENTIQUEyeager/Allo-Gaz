-- =========================================================
-- AlloGaz — onboarding progressif + position domicile client
-- A executer APRES 0001_init.sql (ou le RESET_COMPLET.sql)
-- =========================================================

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

-- Un vendeur avec un profil deja complet (cree avant cette migration) ne doit pas
-- se retrouver bloque sur l'onboarding : on marque comme termine tout profil
-- qui a deja des donnees renseignees.
update public.profiles
set onboarding_completed = true
where full_name is not null and phone is not null and city is not null;

update public.profiles p
set onboarding_completed = true
where exists (select 1 from public.vendors v where v.profile_id = p.id);
