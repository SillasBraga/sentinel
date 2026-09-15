# Código da aplicação

O diretório `src` contém a aplicação Next.js e separa composição de rotas, interface, casos de uso e infraestrutura.

- `app/`: páginas, layouts, estados globais e Route Handlers.
- `components/`: componentes visuais compartilhados.
- `features/`: ações e regras orientadas a domínio.
- `lib/`: autenticação, Supabase, analytics, risco e utilitários.
- `types/`: contratos TypeScript, incluindo tipos gerados do banco.

Leia `src/AGENTS.md` antes de alterações automatizadas. Novas funcionalidades devem manter fluxo unidirecional: página/componente chama uma ação; a ação autentica e valida; o banco aplica RLS; a interface comunica o resultado.
