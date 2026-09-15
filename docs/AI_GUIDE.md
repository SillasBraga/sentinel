# Guia para agentes de IA

Este documento oferece contexto compartilhado para assistentes de código. As instruções hierárquicas ficam nos arquivos `AGENTS.md`; o arquivo mais próximo do código alterado complementa as regras da raiz.

## Antes de editar

1. Leia `AGENTS.md` na raiz e qualquer `AGENTS.md` do diretório alvo.
2. Leia o documento de domínio relevante em `docs/`.
3. Verifique `git status` e preserve mudanças existentes.
4. Inspecione os tipos e migrations reais; não invente colunas ou APIs.
5. Para Next.js 16, consulte a documentação instalada em `node_modules/next/dist/docs/` quando houver dúvida.

## Mapa mental

- `src/app`: composição de rotas, carregamento e redirecionamento.
- `src/components`: UI compartilhada, responsiva e acessível.
- `src/features`: casos de uso, validações e Server Actions.
- `src/lib`: infraestrutura e regras puras reutilizáveis.
- `supabase`: contrato persistente, RLS e funções SQL.

## Invariantes

- Autenticação deve ser revalidada próximo à operação; proxy não autoriza sozinho.
- O banco aplica isolamento com RLS e a ação nunca aceita propriedade do cliente.
- O diário e informações íntimas não são compartilhados por padrão.
- O score de risco é explicável, determinístico e não é diagnóstico.
- Recaídas e check-ins preservam histórico; não substitua eventos silenciosamente.
- Toda mutação voltada ao usuário retorna feedback de sucesso ou erro via toast.
- Tema e layout devem funcionar sem refresh, em claro/escuro e desktop/mobile.
- Movimento deve respeitar `prefers-reduced-motion`.
- Não registre conteúdo sensível em logs, fixtures, prompts ou screenshots.

## Processo de mudança

Para uma mudança vertical, siga o fluxo: migration/RLS → tipos → regra/ação → página/componente → toast/redirecionamento → testes → documentação. Mudanças puramente visuais não devem alterar contratos de dados.

## Validação mínima

Execute os testes proporcionais ao risco e finalize com `npm run check`. Se mexer em RLS, rode também `npx supabase test db`; se mexer em fluxo de usuário, rode o Playwright relevante.

## O que não fazer

- Não contorne tipos com `any` sem justificativa documentada.
- Não mova lógica sensível para Client Components.
- Não introduza uma nova biblioteca sem necessidade e análise do bundle/manutenção.
- Não escolha licença, fornecedor, domínio ou política clínica em nome do proprietário.
- Não apresente o Sentinel como tratamento ou garantia de bloqueio/recuperação.
