# Código da aplicação

O diretório `src` contém a aplicação Next.js e separa composição de rotas, interface, casos de uso e infraestrutura.

- `app/`: páginas, layouts, estados globais e Route Handlers.
- `components/`: componentes visuais compartilhados.
- `features/`: ações e regras orientadas a domínio.
- `lib/`: autenticação, Supabase, analytics, risco e utilitários.
- `types/`: contratos TypeScript, incluindo tipos gerados do banco.

Recursos de jornada ficam distribuídos por domínio: `features/daily-missions` sincroniza missões e conclusão de power-ups; `features/presence-xp` registra créditos imutáveis; `features/milestones` concede marcos privados; `features/attention-zones` valida desafios privados. `components/power-ups-card.tsx` exibe e conclui o equipamento reutilizável na Base e em Meu plano.

Leia `src/AGENTS.md` antes de alterações automatizadas. Novas funcionalidades devem manter fluxo unidirecional: página/componente chama uma ação; a ação autentica e valida; o banco aplica RLS; a interface comunica o resultado.
