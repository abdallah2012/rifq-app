# Architecture

RIFQ uses Next.js App Router and strict TypeScript. UI routes call server actions and repository modules; repositories are the only layer that talks to Supabase. Pure cycle and recommendation domain packages contain no React or database dependencies.

## Boundaries

- `src/domain`: deterministic calculations and scoring.
- `src/features`: feature forms, views, schemas, and services.
- `src/lib/supabase`: browser/server clients and authorization helpers.
- `src/app`: routes, layouts, server actions, and neutral metadata.
- `supabase/migrations`: PostgreSQL schema, constraints, triggers, and RLS.
- `tests`: unit, component, E2E, and documented security checks.

Every private row carries `user_id`. Dynamic profile access resolves ownership server-side and returns the same not-found outcome for absent and unauthorized identifiers. No authenticated API response is cached by the service worker.

Supabase Auth owns credentials and sessions. The service-role key is server-only and is reserved for administrative export/deletion operations where unavoidable.
