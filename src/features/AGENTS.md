# Feature instructions

- Organize actions and validation by domain.
- Server Actions must authenticate, parse with Zod, derive ownership from the session and normalize expected errors.
- Return the shared action result shape so UI toasts remain consistent.
- Revalidate only affected paths and redirect only when it helps the user understand the result.
- Do not include sensitive submitted content in thrown errors or logs.
- Add tests for new calculations and permission branches; database authorization still belongs in RLS.
