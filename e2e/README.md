# Testes end-to-end

Os testes Playwright validam os fluxos visíveis da aplicação. Inicie a infraestrutura local, configure `.env.local` e crie o usuário demo antes de executar cenários autenticados.

```bash
npm run db:start
npm run db:demo
npm run test:e2e
```

Use seletores acessíveis e dados sintéticos. Consulte [docs/TESTING.md](../docs/TESTING.md).
