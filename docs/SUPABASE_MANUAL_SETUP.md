# Supabase manual database setup

This runbook prepares a **development** Supabase project. It does not deploy or migrate anything automatically and does not require `SUPABASE_SECRET_KEY`. Never paste project credentials into SQL files, screenshots, tickets, or command output.

## Reviewed SQL inventory and execution order

Run exactly these database-changing files, in this order:

1. **First:** `supabase/migrations/202607230001_initial_schema.sql`
2. **Seed (after the migration commits):** `supabase/seed.sql`

Then run the read-only check `supabase/tests/verify_schema.sql`. The file `supabase/tests/rls.sql` is an RLS test checklist/query, not a migration, and must not be run as setup.

The migration creates four enum types, ten tables, foreign keys, checks and unique constraints, supporting indexes, timestamp and profile-ownership triggers, and policies after enabling RLS on all ten tables. It is wrapped in one transaction, so a SQL error rolls back that run. User-owned rows cascade from `auth.users`; profile-owned rows cascade from `profiles`. Activity preference rows cascade with an activity, while `activity_feedback.activity_id` intentionally uses `ON DELETE RESTRICT` to preserve feedback history.

## Before running SQL

1. Use a new or otherwise empty **development** project. Confirm the SQL Editor project name and organization; do not use production.
2. In **Authentication > Providers > Email**, enable Email/password. Decide whether email confirmation is required for development; if enabled, test users must confirm before password sign-in.
3. In **Authentication > URL Configuration**, set the Site URL to `NEXT_PUBLIC_APP_URL` (normally `http://localhost:3000`) and add `NEXT_PUBLIC_APP_URL/auth/callback` to Redirect URLs, substituting the configured URL value rather than entering the variable name literally. Add the exact deployed preview origin only when intentionally testing a preview; wildcards are not required for local setup.
4. The application environment contract requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_APP_URL`. The manual schema/seed phase does **not** need a secret/service-role key.
5. Verify the `public` schema does not already contain RIFQ objects. The initial migration is intentionally not generally rerunnable after success.

## SQL Editor procedure

1. Open **SQL Editor > New query** in the development project.
2. Open `supabase/migrations/202607230001_initial_schema.sql` locally, copy the complete file without editing it, and paste it into the editor.
3. Reconfirm the selected project, then click **Run** once. The first statement is `begin;` and the last is `commit;`. Expect successful completion with no result rows.
4. Open a separate new query, copy all of `supabase/seed.sql`, and run it. Expect successful completion and `40` affected/returned insertion operations (the editor wording can vary). A repeat updates the same 40 activity titles rather than duplicating them.
5. Open a third query, copy all of `supabase/tests/verify_schema.sql`, and run it. This script only reads PostgreSQL catalogs.

Do not use “Run selected” for the migration. Do not proceed to the seed if the migration reports an error.

## Expected verification results

The verification script should show:

- Exactly **10** ordinary tables in `public`, and **10** with RLS enabled, provided the development project's `public` schema contains only this application schema.
- Each of the ten expected table rows reports `table_exists = PASS` and `rls_enabled = PASS`.
- Four enums: `budget_level`, `cycle_phase`, `energy_level`, and `feedback_status` with the labels declared by the migration.
- **15 named triggers**: nine `set_updated_at` triggers plus six `enforce_profile_ownership` triggers. `information_schema.triggers` emits one row per trigger event, so the six ownership triggers each appear twice (`INSERT` and `UPDATE`) and the result grid contains 21 rows.
- RLS policies: one authenticated SELECT policy on `activities`; each of the other nine tables has SELECT, INSERT, UPDATE, and DELETE own-row policies (37 policies total).
- Foreign keys to `auth.users`, profile and activity foreign keys, primary keys, checks, and uniqueness constraints. In particular, `activity_feedback_activity_id_fkey` is restrictive and profile/user dependents show cascading deletion.
- Named application indexes including `profiles_user_idx`, profile/date indexes, user lookup indexes, activity foreign-key indexes, the two partial notification uniqueness indexes, and unique `activities_title_ar_idx`. PostgreSQL also lists automatically created indexes for primary/unique constraints.

Optional data check after seeding:

```sql
select count(*) as activity_count,
       count(distinct title_ar) as distinct_activity_titles
from public.activities;
```

Expected: `activity_count = 40` and `distinct_activity_titles = 40` on a fresh setup. Run `supabase/tests/verify_schema.sql` again after any recovery.

## Rerun safety

- `supabase/seed.sql`: safe to rerun after the migration; it upserts by the unique Arabic title and restores seed rows to active.
- `supabase/tests/verify_schema.sql`: safe to rerun; SELECT-only.
- `supabase/tests/rls.sql`: safe catalog SELECT, but its commented behavioral tests require the separate test plan.
- `supabase/migrations/202607230001_initial_schema.sql`: safe against a mid-run error because its transaction rolls back, but **not** safe to rerun after it has committed. `CREATE TYPE`, tables, policies, and triggers intentionally fail rather than silently masking a partially different schema.

## Rollback and recovery

### Error before migration commit

The transaction should roll back all migration-created objects because PostgreSQL DDL and the dynamic policy statements are inside the file's explicit `begin;`/`commit;`. If SQL Editor stopped on the error, the tab may retain an aborted transaction: run `rollback;` in that tab. Then run the read-only `supabase/tests/verify_clean_state.sql`; expect **zero rows**. A returned row means a named RIFQ object exists (including one that predated the failed run), so investigate it rather than rerunning blindly. After an empty result, correct the underlying problem and rerun the complete migration from its first `begin;`. Do not run fragments.

### Migration succeeded but seed failed

Do not remove the schema. Fix only the reported seed issue and rerun the complete `supabase/seed.sql`; its upsert makes partial/repeated seed execution recoverable. Verify the activity count afterward.

### Migration committed with an unexpected catalog result

Stop and preserve the SQL Editor error/result without credentials. For a disposable development project, the safest recovery is to reset/recreate that development database/project and execute the documented order again. If the project contains data that must be retained, take a Supabase-supported backup first and write a new, reviewed forward migration; do not edit catalog tables or rerun arbitrary statements.

### Intentional clean rollback

There is no automatic destructive rollback script. Dropping the schema objects cascades data loss and must not be performed casually. Prefer deleting/recreating the disposable development project. If recovery affects a shared environment, obtain a backup and peer review before any `DROP`, restore, or point-in-time recovery operation.

The verification script proves catalog configuration only. It does not prove remote migration execution or live authorization behavior; execute `docs/SUPABASE_RLS_TEST_PLAN.md` separately with disposable users.
