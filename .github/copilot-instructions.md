# GitHub Copilot instructions

Follow `AGENTS.md` at the repository root and the nearest nested `AGENTS.md`. Read `docs/AI_GUIDE.md` for architecture and privacy invariants.

Sentinel handles sensitive recovery information. Never add real personal data, secrets or production identifiers. Keep authentication close to protected operations, validate input with Zod, enforce ownership through Supabase RLS and preserve light/dark plus desktop/mobile parity. Run `npm run check` for completed changes.
