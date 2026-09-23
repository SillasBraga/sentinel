# Banco de dados

O Sentinel usa PostgreSQL no Supabase. Auth fornece a identidade; tabelas públicas referenciam `auth.users` e protegem registros com Row Level Security.

## Migrations

Migrations ficam em `supabase/migrations` e devem ser imutáveis depois de compartilhadas. Para uma alteração nova:

1. Crie uma migration com timestamp crescente e nome descritivo.
2. Inclua tabelas, índices, constraints, funções e políticas no mesmo conjunto lógico.
3. Recrie o banco local com `npm run db:reset`.
4. Execute `npx supabase test db`.
5. Regenere os tipos com `npm run db:types`.

## Segurança por linha

- Ative RLS em toda tabela com dados pessoais.
- Políticas de proprietário devem derivar a identidade de `auth.uid()`.
- Nunca confie em `user_id` vindo do formulário.
- Compartilhamento por accountability exige relacionamento ativo e permissão explícita.
- Funções `security definer` devem fixar um `search_path` seguro e validar o chamador.

Os testes em `supabase/tests/rls.sql` verificam isolamento entre contas e permissões críticas. Uma interface que esconde dados não substitui RLS.

## Dados e eventos

O modelo privilegia histórico em vez de sobrescrita: check-ins, conclusões e recaídas são eventos. Indicadores como sequência, alinhamento e risco são derivados desses registros. Preferências estáveis ficam no perfil; o tema atual e o ambiente visual escolhido são persistidos por usuário. `cosmetic_style` aceita apenas o catálogo local de ambientes e não armazena progresso: os desbloqueios são sempre derivados do histórico imutável de XP de presença.

`relapse_events` também pode guardar o plano de retomada privado do evento: relato do ocorrido, barreira, ação de proteção nas próximas 24 horas e missão leve para amanhã. Todos os campos são opcionais e não entram em XP, missões, sequência ou compartilhamento com accountability.

`daily_missions` mantém o estado resumido das três missões do dia civil do usuário: check-in, ao menos um hábito e um power-up de proteção. A chave primária é `(user_id, local_date)` e o `completed_at` só existe quando as três estão concluídas. Os eventos de check-in e hábito continuam sendo a fonte de histórico; a tabela de missões é um estado de interface persistido.

`daily_focuses` mantém um foco textual por usuário e dia civil, usando o fuso salvo no perfil. O usuário pode revisar ou marcar o foco como concluído durante o dia; ele não gera XP, não é compartilhado e não altera missões ou sequência.

`attention_zones` registra desafios nomeados pelo usuário. Registros de impulso podem apontar para uma zona e para a estratégia de proteção usada; assim a interface calcula frequência, contexto e estratégia mais registrada sem expor dados a outras pessoas.

`alternative_activities` é o catálogo privado de power-ups reutilizáveis. `power_up_logs` preserva uma conclusão por ação e dia civil; `complete_power_up` valida a ação e o dia pelo usuário autenticado. A primeira conclusão diária atualiza missão de proteção e pode conceder os 10 XP já definidos para esse crédito.

`presence_xp_events` registra créditos de XP sem políticas de `update` ou `delete`. `award_presence_xp` valida que o evento de origem pertence ao usuário autenticado, define o valor permitido e usa uma chave única por fonte, impedindo crédito repetido ou arbitrário. XP é acumulativo e não é afetado por recaídas.

`user_achievements` preserva marcos privados uma única vez por usuário e marco. `award_private_milestones` usa apenas `auth.uid()` e dados do próprio usuário para avaliar os critérios; clientes não podem inserir marcos diretamente. O catálogo inicial celebra check-ins, presença, SOS e recomeços, sem comparação entre pessoas.

## Tipos gerados

`src/types/database.generated.ts` representa o schema que o TypeScript conhece. Sempre regenere após alterar o banco. Não edite o arquivo manualmente.

## Produção

Antes de aplicar migrations:

- faça backup e verifique o plano de rollback;
- teste em um projeto de staging;
- revise locks e alterações destrutivas;
- aplique migrations antes do código que depende delas quando houver compatibilidade retroativa;
- valide RLS com dois usuários distintos.

Seeds e credenciais de demonstração não devem ser executados no projeto de produção.
