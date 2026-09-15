# Como contribuir

Obrigado por ajudar a evoluir o Sentinel. Como a aplicação lida com informações potencialmente sensíveis, privacidade e previsibilidade têm o mesmo peso que funcionalidade e aparência.

## Fluxo recomendado

1. Abra ou relacione uma issue que descreva o problema e o resultado esperado.
2. Crie uma branch curta a partir da branch principal: `feat/...`, `fix/...`, `docs/...` ou `chore/...`.
3. Faça mudanças pequenas e focadas, incluindo migrations e testes quando necessário.
4. Execute `npm run check`, os testes E2E afetados e os testes do banco.
5. Abra o pull request usando o template e inclua imagens para alterações visuais.

## Padrões do projeto

- Use TypeScript estrito e valide entradas externas com Zod.
- Mantenha regras de negócio em `src/features` ou `src/lib`, evitando duplicá-las em páginas.
- Use Server Actions para mutações autenticadas e retorne o contrato compartilhado de ações.
- Toda tabela com dados de usuários precisa de RLS e de testes de isolamento.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` em código cliente.
- Preserve acessibilidade, navegação por teclado, foco visível e `prefers-reduced-motion`.
- Garanta paridade entre temas claro/escuro e entre desktop/mobile.
- Textos voltados ao usuário devem permanecer acolhedores, discretos e não clínicos.

## Commits

Prefira mensagens objetivas no imperativo, por exemplo:

```text
feat: adiciona resultado do check-in
fix: corrige contraste do SOS no tema claro
docs: documenta deploy no Supabase
```

## Banco e migrations

Não altere migrations que já tenham sido compartilhadas. Crie uma nova migration com nome descritivo e timestamp crescente, regenere os tipos e verifique as políticas:

```bash
npm run db:reset
npm run db:types
npx supabase test db
```

## Pull requests

O PR deve explicar o motivo da mudança, como foi validada, impactos de privacidade e passos de migração. Não inclua dados reais, tokens, e-mails pessoais ou screenshots não anonimizados.

Leia também [docs/AI_GUIDE.md](docs/AI_GUIDE.md) se estiver usando um agente de IA.
