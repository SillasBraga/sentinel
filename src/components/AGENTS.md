# Component instructions

- Build components around reusable behavior, not page-specific abstractions.
- Follow the existing design tokens and CSS variables in `src/app/globals.css`.
- Interactive elements need pointer cursor, visible focus, hover/pressed states and short smooth transitions.
- Support light/dark themes without hard-coded light surfaces or illegible accent text.
- Responsive components must not create horizontal overflow or cover primary content/navigation.
- Portaled modals must trap/restore focus where applicable, close with Escape, label their dialog and prevent accidental destructive actions.
- Respect `prefers-reduced-motion`; animation may clarify state but must not block use.
