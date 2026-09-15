<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Sentinel repository instructions

## Mission and safety

Sentinel is a privacy-sensitive recovery support PWA. Treat check-ins, journal entries, urges, relapses, motivations and accountability data as sensitive. Never put real user content, secrets, invite tokens or production identifiers in source, fixtures, logs, issues or screenshots.

This product supports self-care; do not introduce medical claims, diagnoses, guarantees or shaming language.

## Architecture

- `src/app`: App Router pages, layouts and route handlers. Prefer Server Components.
- `src/components`: reusable UI and intentionally small Client Components.
- `src/features`: domain use cases, Zod validation and authenticated Server Actions.
- `src/lib`: infrastructure and pure reusable rules.
- `supabase`: migrations, seed and RLS tests; it is the persistent contract.
- `tests` and `e2e`: unit/integration and browser coverage.

Read `docs/AI_GUIDE.md` and the nearest nested `AGENTS.md` before changing a directory.

## Required invariants

- Authenticate with `getUser()` close to every protected read or mutation.
- Derive ownership from the session; never trust a submitted `user_id`.
- Enforce authorization in RLS as well as application code.
- Validate external input with Zod.
- Keep the risk engine deterministic, explainable and covered by unit tests.
- Preserve event history for check-ins and relapses.
- Give visible, theme-aware feedback for user mutations.
- Maintain desktop/mobile and light/dark parity, keyboard access and reduced-motion support.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Editing and validation

Preserve unrelated working-tree changes. Do not edit generated database types manually or rewrite applied migrations. Update documentation when commands, architecture, data or user-visible behavior changes.

Run the smallest relevant checks during development and `npm run check` before completion. Add `npx supabase test db` for database/RLS work and relevant Playwright tests for critical flows.
