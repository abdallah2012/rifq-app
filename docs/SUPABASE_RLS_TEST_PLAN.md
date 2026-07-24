# Supabase RLS test plan

## Scope and safety

Run this plan only after the manual setup guide succeeds in a development project. It validates authenticated ownership, anonymous denial, public activity reads, cross-profile integrity, and cascade behavior. It is a manual plan, not evidence that live RLS has passed. Use two newly created disposable users with synthetic email addresses under a domain you control; never place their emails, UUIDs, passwords, access tokens, publishable key, or project URL in the repository or test evidence.

The Supabase SQL Editor normally runs with an administrative role that bypasses RLS. Therefore, ordinary SQL Editor table queries are **not** valid behavioral RLS tests. Use the application/browser client separately signed in as each test user, or an API client configured only at runtime with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Use `NEXT_PUBLIC_APP_URL` as the application origin and inspect tokens locally without printing or recording them.

## Preconditions

- Email/password is enabled. If email confirmation is enabled, confirm both disposable accounts.
- Site URL and the exact `/auth/callback` Redirect URL match the development origin.
- `supabase/tests/verify_schema.sql` reports all ten tables present and RLS-enabled.
- The seed contains 40 active activities.
- Create User A and User B through normal Supabase Auth signup. Keep each session isolated (for example, separate private browser profiles).
- Capture generated profile/row IDs only in an ephemeral local scratchpad. Do not commit them.

## Test matrix

For each operation, record only pass/fail, timestamp, table, operation, and sanitized error class. Do not record request authorization headers or row contents.

1. **Anonymous denial:** signed out, SELECT each of the nine private tables: `profiles`, `cycle_records`, `daily_checkins`, `profile_activity_preferences`, `activity_feedback`, `profile_phase_preferences`, `notification_preferences`, `user_settings`, and `audit_events`. Expect zero rows (or the API's equivalent empty successful result). Anonymous INSERT/UPDATE/DELETE attempts must be denied or affect zero rows.
2. **Anonymous activities:** signed out, SELECT `activities`. Expect zero rows because its policy is granted only to `authenticated`.
3. **Authenticated activity library:** as User A and User B, SELECT active activities. Expect the 40 active seed rows. Attempts to INSERT, UPDATE, or DELETE activities must be denied.
4. **Own profile CRUD:** as User A, insert a profile with `user_id` set to User A. SELECT and UPDATE it successfully. Do not delete it until cascade testing.
5. **Cross-user isolation:** as User B, SELECT User A's profile by its ephemeral ID. Expect zero rows. UPDATE and DELETE must affect zero rows. INSERT a profile carrying User A's ID must fail the policy check.
6. **Child ownership:** as User A, insert a cycle record and daily check-in for User A's profile with User A's `user_id`; expect success. As User B, attempts using User A's profile ID must fail even when the new row claims User B's ID. This verifies both own-row policy and `enforce_profile_ownership`.
7. **Notification ownership:** as User A, insert one default notification preference (`profile_id` null) and one for User A's profile; expect success. A duplicate of either logical preference must fail uniqueness. As User B, associating a notification preference with User A's profile must fail.
8. **Preferences and feedback:** as User A, use an active activity ID to create profile activity preference, phase preference, and activity feedback rows. Expect success. Repeat the cross-profile attempts as User B; expect failure.
9. **Settings uniqueness:** User A can insert one `user_settings` row. A second row for User A fails uniqueness. User B cannot read or change User A's row.
10. **Audit isolation:** User A can insert/read its own audit event but User B cannot read, update, or delete it.
11. **Update ownership immutability:** as User A, attempt to change an owned row's `user_id` to User B. Expect failure from the UPDATE `WITH CHECK`. Attempt to move a profile-owned row to User B's profile (create a disposable User B profile first); expect the ownership trigger to fail.
12. **Cascade and restrict in disposable data:** create a disposable feedback row referencing an activity. An administrative attempt to delete that activity must be restricted while feedback exists. Delete User A's disposable profile through the authenticated client; expect its cycle records, check-ins, profile preferences, feedback, and profile-scoped notifications to disappear. User-level default notifications/settings/audits remain until the auth user is deleted. Deleting the disposable auth user administratively should cascade remaining user-owned rows.

## Result criteria

Pass only if every expected allow succeeds, every expected denial returns no protected data, cross-profile writes fail, uniqueness holds, cascade/restrict behavior matches the matrix, and both users remain unable to observe each other's rows. A policy error is acceptable for denied writes; an empty result is acceptable for filtered SELECT/UPDATE/DELETE operations.

If any test exposes another user's row, stop testing, do not deploy, preserve only sanitized metadata, and correct the schema in a new reviewed migration. After a failure or interrupted run, delete the disposable users through the development Auth dashboard so `auth.users` cascades their data, then use `supabase/tests/verify_schema.sql` to ensure catalog objects remain intact.

## Cleanup

Delete both disposable users from **Authentication > Users** in the development project. Re-run the catalog verification and confirm no test rows remain in private tables. Do not delete the seeded activities. Never perform this cleanup against production.
