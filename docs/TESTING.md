# Testes e validação

## Pirâmide atual

- `tests/`: regras puras de risco, recuperação e permissões com Vitest.
- `supabase/tests/`: isolamento e políticas RLS executados pelo Supabase CLI.
- `e2e/`: fluxos reais de navegador com Playwright.
- `npm run typecheck`, `npm run lint` e `npm run build`: contratos, qualidade estática e integração do Next.js.

## Validação completa

```bash
npm run check
npm run test:e2e
npx supabase test db
```

Os testes de autenticação E2E dependem do Supabase local, `.env.local` e do usuário demo. Testes públicos podem rodar sem sessão.

## Ao adicionar funcionalidades

- Regra de cálculo: teste unitário determinístico.
- Server Action: teste validação, não autenticado, sucesso e erro.
- Nova tabela/política: teste RLS com proprietário e outra conta.
- Fluxo essencial: teste E2E do caminho feliz e de um erro relevante.
- Alteração visual: revise desktop/mobile, claro/escuro, teclado e redução de movimento.

## Evite testes frágeis

Prefira consultas acessíveis por papel, nome e rótulo. Não dependa de classes CSS ou tempos arbitrários. Congele datas quando o comportamento depender do calendário e use dados sintéticos, nunca dados reais.

## CI

O workflow em `.github/workflows/ci.yml` executa instalação limpa, typecheck, lint, testes unitários e build. Os testes que exigem Docker/Supabase devem ser adicionados a um job dedicado quando o repositório estiver hospedado.
