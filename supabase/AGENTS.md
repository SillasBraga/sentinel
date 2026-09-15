# Supabase instructions

- Never modify an already shared migration; create a new timestamped migration.
- Every user-owned table requires RLS, explicit policies and indexes for common owner/time queries.
- Use `auth.uid()` for identity and validate every `security definer` function carefully.
- Fix a safe `search_path` in privileged functions and avoid dynamic SQL.
- Invite secrets are stored only as hashes, expire and are single-use.
- Seeds must contain synthetic local data only and must be safe to discard.
- After schema work run `npm run db:reset`, `npx supabase test db`, `npm run db:types` and `npm run typecheck`.
