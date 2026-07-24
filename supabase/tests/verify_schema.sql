-- Non-destructive catalog verification for the RIFQ schema.
-- This script performs SELECTs only and is safe to rerun.
with expected(table_name) as (
  values ('profiles'), ('cycle_records'), ('daily_checkins'), ('activities'),
         ('profile_activity_preferences'), ('activity_feedback'),
         ('profile_phase_preferences'), ('notification_preferences'),
         ('user_settings'), ('audit_events')
)
select e.table_name,
       case when c.oid is not null then 'PASS' else 'MISSING' end as table_exists,
       case when c.relrowsecurity then 'PASS' else 'DISABLED' end as rls_enabled
from expected e
left join pg_catalog.pg_class c
  on c.relnamespace = 'public'::regnamespace
 and c.relname = e.table_name
 and c.relkind = 'r'
order by e.table_name;

select count(*) as public_table_count,
       count(*) filter (where relrowsecurity) as rls_enabled_table_count
from pg_catalog.pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r';

select tablename, indexname, indexdef
from pg_catalog.pg_indexes
where schemaname = 'public'
order by tablename, indexname;

select conrelid::regclass as table_name, conname, contype,
       pg_catalog.pg_get_constraintdef(oid) as definition
from pg_catalog.pg_constraint
where connamespace = 'public'::regnamespace
order by conrelid::regclass::text, contype, conname;

select event_object_table as table_name, trigger_name,
       event_manipulation, action_timing
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name, event_manipulation;

select tablename, policyname, roles, cmd, qual, with_check
from pg_catalog.pg_policies
where schemaname = 'public'
order by tablename, policyname;

select n.nspname as schema_name, t.typname as enum_name,
       string_agg(e.enumlabel, ', ' order by e.enumsortorder) as labels
from pg_catalog.pg_type t
join pg_catalog.pg_namespace n on n.oid = t.typnamespace
join pg_catalog.pg_enum e on e.enumtypid = t.oid
where n.nspname = 'public'
group by n.nspname, t.typname
order by t.typname;
