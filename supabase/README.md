# Supabase

Este diretório define o ambiente local e o contrato persistente do Sentinel.

- `config.toml`: portas e serviços do Supabase local.
- `migrations/`: evolução ordenada do schema, funções e políticas.
- `seed.sql`: dados sintéticos mínimos para desenvolvimento.
- `tests/rls.sql`: testes de isolamento e autorização.

As migrations recentes acrescentam `daily_focuses`, `attention_zones` e `power_up_logs`. A função `complete_power_up` valida usuário, propriedade da ação e data civil antes de registrar uma conclusão; as funções de XP e marcos preservam eventos imutáveis.

Fluxo comum:

```bash
npm run db:start
npm run db:reset
npx supabase test db
npm run db:types
```

Não execute o seed ou o criador de usuário demo em produção. Consulte [docs/DATABASE.md](../docs/DATABASE.md) e `supabase/AGENTS.md`.
