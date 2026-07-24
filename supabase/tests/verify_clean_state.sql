-- Run after ROLLBACK when an initial migration attempt fails.
-- Read-only: an empty result confirms that no named RIFQ objects from the
-- initial migration remain. Pre-existing objects with these names are reported.
with rifq_tables(object_name) as (
  values ('profiles'), ('cycle_records'), ('daily_checkins'), ('activities'),
         ('profile_activity_preferences'), ('activity_feedback'),
         ('profile_phase_preferences'), ('notification_preferences'),
         ('user_settings'), ('audit_events')
),
rifq_types(object_name) as (
  values ('cycle_phase'), ('energy_level'), ('budget_level'), ('feedback_status')
),
rifq_functions(object_name) as (
  values ('set_updated_at'), ('owns_profile'), ('enforce_profile_ownership')
),
remaining_objects as (
  select 'table'::text as object_type, c.relname::text as object_name
  from pg_catalog.pg_class c
  join rifq_tables expected on expected.object_name = c.relname
  where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p')
  union all
  select 'enum', t.typname
  from pg_catalog.pg_type t
  join rifq_types expected on expected.object_name = t.typname
  where t.typnamespace = 'public'::regnamespace and t.typtype = 'e'
  union all
  select 'policy', p.tablename || '.' || p.policyname
  from pg_catalog.pg_policies p
  join rifq_tables expected on expected.object_name = p.tablename
  where p.schemaname = 'public'
  union all
  select 'function', p.proname
  from pg_catalog.pg_proc p
  join rifq_functions expected on expected.object_name = p.proname
  where p.pronamespace = 'public'::regnamespace
)
select object_type, object_name
from remaining_objects
order by object_type, object_name;
