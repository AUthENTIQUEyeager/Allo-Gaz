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
