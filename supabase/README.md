# Supabase

Este diretório define o ambiente local e o contrato persistente do Sentinel.

- `config.toml`: portas e serviços do Supabase local.
- `migrations/`: evolução ordenada do schema, funções e políticas.
- `seed.sql`: dados sintéticos mínimos para desenvolvimento.
- `tests/rls.sql`: testes de isolamento e autorização.

Fluxo comum:

```bash
npm run db:start
npm run db:reset
npx supabase test db
npm run db:types
```

Não execute o seed ou o criador de usuário demo em produção. Consulte [docs/DATABASE.md](../docs/DATABASE.md) e `supabase/AGENTS.md`.
