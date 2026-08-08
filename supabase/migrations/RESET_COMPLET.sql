-- =========================================================
-- ETAPE 1 : Nettoyage complet de l'ancien projet
-- =========================================================
do $$
declare r record;
begin
  for r in (select tablename from pg_tables where schemaname = 'public') loop
    execute 'drop table if exists public.' || quote_ident(r.tablename) || ' cascade';
  end loop;
end $$;

do $$
declare r record;
begin
  for r in (select typname from pg_type t
            join pg_namespace n on n.oid = t.typnamespace
            where n.nspname = 'public' and t.typtype = 'e') loop
    execute 'drop type if exists public.' || quote_ident(r.typname) || ' cascade';
  end loop;
end $$;

do $$
declare r record;
begin
  for r in (select proname, oidvectortypes(proargtypes) as args
            from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public') loop
    execute 'drop function if exists public.' || quote_ident(r.proname) || '(' || r.args || ') cascade';
  end loop;
end $$;

-- Supprime aussi un trigger residuel eventuel sur auth.users (important : specifique a ce debug)
drop trigger if exists on_auth_user_created on auth.users;
-- =========================================================
-- AlloGaz — schema initial
-- A executer dans Supabase > SQL Editor (une seule fois)
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------- ENUMS ----------
create type user_role as enum ('client', 'vendor', 'admin');
create type vendor_status as enum ('pending', 'active', 'suspended');
create type gas_brand as enum ('Total', 'Oryx', 'Shell', 'Winstar', 'SODIGAZ', 'Autre');
create type delivery_method as enum ('delivery', 'pickup');
create type payment_method as enum ('orange_money', 'moov_money', 'especes');
create type order_status as enum ('pending', 'accepted', 'delivering', 'completed', 'cancelled');

-- ---------- PROFILES (etend auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  full_name text,
  phone text,
  city text,
  neighborhood text,
  default_address text,
  created_at timestamptz not null default now()
);

-- ---------- VENDORS ----------
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  business_name text not null,
  phone text not null,
  city text not null,
  neighborhood text,
  latitude double precision,
  longitude double precision,
  status vendor_status not null default 'pending',
  opening_hours text,
  delivery_fee numeric(10,2) not null default 0,
  rating numeric(2,1) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- GAS STOCK ----------
create table public.gas_stock (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  brand gas_brand not null,
  capacity_kg integer not null,
  full_bottles integer not null default 0,
  empty_bottles integer not null default 0,
  price numeric(10,2) not null,
  updated_at timestamptz not null default now(),
  unique (vendor_id, brand, capacity_kg)
);

-- ---------- ORDERS ----------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  brand gas_brand not null,
  capacity_kg integer not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 0,
  total_price numeric(10,2) not null,
  delivery_method delivery_method not null default 'delivery',
  address text,
  phone text not null,
  payment_method payment_method not null default 'especes',
  status order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- REVIEWS ----------
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade unique,
  client_id uuid not null references public.profiles(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ---------- INDEXES ----------
create index idx_vendors_status on public.vendors(status);
create index idx_vendors_city on public.vendors(city);
create index idx_gas_stock_vendor on public.gas_stock(vendor_id);
create index idx_orders_client on public.orders(client_id);
create index idx_orders_vendor on public.orders(vendor_id);
create index idx_orders_status on public.orders(status);

-- =========================================================
-- Trigger : creation automatique du profil a l'inscription
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone, city)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- Trigger : mise a jour automatique de la note moyenne vendeur
-- =========================================================
create or replace function public.update_vendor_rating()
returns trigger as $$
begin
  update public.vendors
  set rating = (select round(avg(rating)::numeric, 1) from public.reviews where vendor_id = new.vendor_id),
      rating_count = (select count(*) from public.reviews where vendor_id = new.vendor_id)
  where id = new.vendor_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert on public.reviews
  for each row execute procedure public.update_vendor_rating();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.gas_stock enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

-- Fonction utilitaire : recuperer le role de l'utilisateur connecte
create or replace function public.current_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- ---------- PROFILES ----------
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.current_role() = 'admin');

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- ---------- VENDORS ----------
create policy "vendors_select_public"
  on public.vendors for select
  using (status = 'active' or profile_id = auth.uid() or public.current_role() = 'admin');

create policy "vendors_insert_own"
  on public.vendors for insert
  with check (profile_id = auth.uid());

create policy "vendors_update_own_or_admin"
  on public.vendors for update
  using (profile_id = auth.uid() or public.current_role() = 'admin');

-- ---------- GAS STOCK ----------
create policy "stock_select_public"
  on public.gas_stock for select
  using (true);

create policy "stock_write_own_vendor"
  on public.gas_stock for all
  using (vendor_id in (select id from public.vendors where profile_id = auth.uid()))
  with check (vendor_id in (select id from public.vendors where profile_id = auth.uid()));

-- ---------- ORDERS ----------
create policy "orders_select_involved"
  on public.orders for select
  using (
    client_id = auth.uid()
    or vendor_id in (select id from public.vendors where profile_id = auth.uid())
    or public.current_role() = 'admin'
  );

create policy "orders_insert_client"
  on public.orders for insert
  with check (client_id = auth.uid());

create policy "orders_update_involved"
  on public.orders for update
  using (
    client_id = auth.uid()
    or vendor_id in (select id from public.vendors where profile_id = auth.uid())
    or public.current_role() = 'admin'
  );

-- ---------- REVIEWS ----------
create policy "reviews_select_public"
  on public.reviews for select
  using (true);

create policy "reviews_insert_client"
  on public.reviews for insert
  with check (client_id = auth.uid());

-- =========================================================
-- Compte admin : a executer APRES avoir cree un compte normal
-- Remplace l'email ci-dessous puis lance cette ligne seule
-- =========================================================
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'admin@allogaz.com');
