# App Router instructions

- Pages are Server Components by default; fetch protected data on the server.
- Use route groups/layouts consistently and keep redirect decisions close to authentication checks.
- Mutations belong in feature Server Actions, not inline in pages.
- Protected routes live below `/app`; public auth/legal routes must not assume a session.
- Preserve query-string toast handling and purposeful post-action redirects.
- Add `loading`, empty and error states when a route performs meaningful I/O.
- Avoid caching private responses. Export and other sensitive Route Handlers must use `no-store` and safe content headers.
- Keep metadata, manifest and offline behavior aligned with PWA changes.
