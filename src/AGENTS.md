# Source instructions

These rules apply to all application source under `src/`.

- Keep server-only and client code boundaries explicit. Add `"use client"` only where browser state or events require it.
- Use the shared Supabase factories; do not construct ad-hoc clients or leak server environment variables.
- Reuse domain actions and shared UI instead of duplicating validation or styling.
- User-facing Portuguese text must be correctly encoded as UTF-8 and reviewed for clarity.
- New interactions need loading/disabled behavior and success/error feedback.
- Check layout and contrast in both themes and at mobile and desktop breakpoints.
- Prefer semantic HTML and accessible names. Icon-only controls require an `aria-label` and tooltip/title where useful.
