# Library instructions

- Prefer pure functions for calculations, dates and permissions.
- Keep environment access centralized in `env.ts` and fail with actionable messages.
- Server modules must not be imported by Client Components.
- Risk and analytics outputs must be deterministic, time-zone aware and explainable.
- A change to scoring or streak semantics requires unit tests and documentation of its user-visible effect.
- Do not silently weaken security to simplify call sites.
