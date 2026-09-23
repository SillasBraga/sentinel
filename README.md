# Sentinel

Plataforma web e PWA de apoio à recuperação e à construção de hábitos saudáveis. O Sentinel reúne registros de momento e recomeço, indicadores de risco, modo SOS, diário, metas, hábitos e acompanhamento por uma pessoa de confiança em uma experiência discreta e responsiva.

> O Sentinel é uma ferramenta de autocuidado e organização pessoal. Ele não substitui atendimento médico, psicológico, psiquiátrico ou serviços de emergência.

## Principais recursos

- Autenticação por e-mail e senha, recuperação de senha e link mágico via Supabase Auth.
- Onboarding e preferências pessoais protegidas por Row Level Security (RLS).
- Check-in emocional com resultado explicativo e atualização dos indicadores.
- Dashboard, calendário histórico navegável, hábitos, metas, diário e objetivo diário privado.
- Missões diárias e XP de presença, com créditos limitados por evento e sem ranking público.
- Marcos privados que celebram presença, autocuidado, SOS e recomeços sem competição.
- Zonas de atenção para desafios recorrentes, com contexto, estratégia de proteção e atalhos para SOS.
- Power-ups reutilizáveis no menu **Meu plano**, concluíveis uma vez por ação por dia e conectados à missão de proteção.
- Plano de retomada privado após um recomeço, com reflexão opcional e ações pequenas para as próximas 24 horas.
- Fluxo SOS com pausa guiada de dez minutos.
- Aliado opcional com permissões explícitas por dado, diário privado por padrão e pedidos neutros de apoio.
- Tema claro/escuro persistido por usuário e interface responsiva/PWA.
- Toasts para confirmar inserções, alterações, exclusões e erros.
- Exportação dos próprios dados e controles de privacidade.

## Stack

- Next.js 16 (App Router e Turbopack)
- React 19 e TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL, Auth e RLS)
- Zod, Vitest e Playwright
- Recharts e Lucide React

## Começando

### Pré-requisitos

- Node.js 24 ou superior
- npm 10 ou superior
- Docker Desktop, para executar o Supabase local
- Supabase CLI (o projeto também pode invocá-la com `npx`)

### Instalação local

```bash
git clone <URL_DO_REPOSITORIO>
cd sentinel
npm ci
```

Copie `.env.example` para `.env.local` e preencha as variáveis. Para usar a infraestrutura local:

```bash
npm run db:start
npm run db:reset
```

O comando `npx supabase status` mostra a URL e as chaves locais que devem ser usadas em `.env.local`. Depois, inicie a aplicação:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Usuário de demonstração local

Com o Supabase local em execução e `.env.local` configurado:

```bash
npm run db:demo
```

Por padrão, o script cria duas contas locais: `demo@sentinel.local` com a senha `SentinelDemo2026!` e `ally@sentinel.local` com a senha `AllyDemo2026!`. Use a primeira para a jornada e a segunda para testar convites de Aliado. Essas credenciais são apenas para desenvolvimento local; nunca devem ser usadas em produção.

## Variáveis de ambiente

| Variável                        | Escopo           | Obrigatória                            | Descrição                                       |
| ------------------------------- | ---------------- | -------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Cliente/servidor | Sim                                    | URL do projeto Supabase.                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente/servidor | Sim                                    | Chave pública `anon`.                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Somente servidor | Apenas para automações administrativas | Chave privilegiada; nunca exponha no navegador. |
| `NEXT_PUBLIC_APP_URL`           | Cliente/servidor | Sim                                    | URL pública da aplicação, sem barra final.      |

Veja [docs/SETUP.md](docs/SETUP.md) para configuração detalhada e [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para produção.

## Comandos

| Comando             | Finalidade                                    |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento.                  |
| `npm run build`     | Build de produção.                            |
| `npm start`         | Executa o build de produção.                  |
| `npm run typecheck` | Validação do TypeScript.                      |
| `npm run lint`      | Análise estática com ESLint.                  |
| `npm test`          | Testes unitários com Vitest.                  |
| `npm run test:e2e`  | Testes de interface com Playwright.           |
| `npm run check`     | Typecheck, lint, testes e build em sequência. |
| `npm run db:start`  | Inicia o Supabase local.                      |
| `npm run db:reset`  | Recria o banco e aplica migrations/seed.      |
| `npm run db:types`  | Regenera tipos do banco local.                |
| `npm run db:demo`   | Cria/atualiza o usuário demo local.           |

## Estrutura

```text
src/app/            Rotas, layouts, páginas e Route Handlers
src/components/     Componentes compartilhados de interface
src/features/       Casos de uso e Server Actions por domínio
src/lib/            Infraestrutura, autenticação, risco e utilitários
src/types/          Tipos TypeScript e tipos gerados do banco
supabase/            Configuração, migrations, seed e testes RLS
tests/               Testes unitários e de integração leve
e2e/                 Testes end-to-end do navegador
scripts/             Automações locais controladas
docs/                Documentação técnica e operacional
```

## Qualidade e segurança

Antes de abrir um pull request, execute:

```bash
npm run check
npm run test:e2e
npx supabase test db
```

Dados desta aplicação podem ser sensíveis. Não inclua `.env.local`, chaves, dumps, prints com informações pessoais ou dados reais em commits e issues. As políticas de autorização devem ser aplicadas no banco por RLS, não apenas escondidas na interface.

## Documentação

- [Índice da documentação](docs/README.md)
- [Configuração local](docs/SETUP.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Banco de dados](docs/DATABASE.md)
- [Testes](docs/TESTING.md)
- [Deploy](docs/DEPLOYMENT.md)
- [Publicação no GitHub](docs/GITHUB.md)
- [Segurança](docs/SECURITY.md)
- [Guia para agentes de IA](docs/AI_GUIDE.md)
- [Roadmap](docs/ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Como contribuir](CONTRIBUTING.md)

## Licença

Este repositório ainda não declara uma licença de código aberto. Antes de torná-lo público, o proprietário deve escolher e adicionar uma licença compatível com o uso pretendido. Sem uma licença explícita, permanecem reservados os direitos autorais aplicáveis.
