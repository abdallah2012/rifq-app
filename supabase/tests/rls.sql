-- Run with two authenticated test JWTs in separate SQL sessions.
-- 1. Insert profile as User A; SELECT as User B must return zero rows.
-- 2. UPDATE/DELETE User A profile as User B must affect zero rows.
-- 3. Insert cycle with User A user_id and User B profile_id must fail.
-- 4. Reset role to anon; every private table SELECT must return zero rows.
select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('profiles','cycle_records','daily_checkins','profile_activity_preferences','activity_feedback','profile_phase_preferences','notification_preferences','user_settings','audit_events');
