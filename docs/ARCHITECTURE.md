# Arquitetura

## Visão geral

O Sentinel é organizado por domínio. Rotas do App Router compõem Server Components; interação temporal (onboarding e SOS) usa Client Components pequenos. Mutações passam por Server Actions, que autenticam com `getUser()`, validam com Zod e restringem a operação ao `user_id` da sessão.

## Fluxo de dados

```text
Browser/PWA → Proxy (refresh de sessão) → Server Component / Server Action
                                      → Supabase Auth
                                      → PostgreSQL + RLS
```

O Proxy faz somente checagem otimista e atualização de cookies. A autorização real ocorre novamente perto da consulta e no banco por RLS.

## Recuperação e analytics

`recovery_profiles.started_at` e `relapse_events` formam o histórico de eventos. A sequência atual representa dias civis desde o início da jornada ou desde a recaída registrada mais recente; check-ins, impulsos e sessões SOS não a reiniciam. Streak atual, recorde e dias alinhados são derivados, e uma recaída nunca sobrescreve o histórico. Datas de calendário são convertidas para o fuso do perfil antes do cálculo, evitando dividir milissegundos por 24 horas.

O risk engine é uma função pura que soma contribuições explícitas e retorna `{ score, level, factors }`. A interface mostra os fatores e não faz previsões deterministas. Insights exigem amostra mínima.

Após um check-in, o usuário é encaminhado ao resultado explicativo, que relaciona o registro aos indicadores sem prometer causalidade clínica. Inserções, alterações e exclusões usam um contrato compartilhado de resultado e toasts temporários para tornar o estado da operação visível.

Na interface, os registros foram consolidados em dois fluxos principais: **momento** (humor, intensidade do impulso, exposição e contexto, persistido em `daily_checkins`) e **recaída/recomeço** (persistido em `relapse_events`). `urges` permanece como histórico compatível para registros detalhados anteriores e continua entrando nos agregados. O SOS é uma intervenção, não um terceiro formulário de registro; sua sessão é persistida automaticamente e passa a alimentar Início, Progresso e Calendário quando concluída.

Entradas do diário são privadas e podem ser editadas ou excluídas pelo proprietário, sempre com confirmação antes da exclusão. O XP de reflexão, se já concedido, permanece como histórico de presença e não é removido ao alterar ou excluir a nota.

O calendário cruza check-ins, conclusões de hábitos, impulsos, sessões SOS, metas e recomeços pelo fuso horário do perfil. A grade mensal é navegável, inclui filtros locais e exibe apenas resumos no detalhe diário; textos íntimos de recaídas, impulsos e diário não são reproduzidos nessa visão agregada.

As missões diárias usam `daily_missions`, indexada por usuário e data civil no fuso do perfil. Check-in e primeira conclusão de hábito do dia sincronizam o estado automaticamente; o power-up de proteção é uma confirmação explícita do usuário. A conclusão não altera a sequência de recuperação nem compartilha dados com accountability.

XP de presença é um histórico imutável em `presence_xp_events`: check-in rende 15 XP, hábito 10, SOS concluído 20, reflexão no diário 10, power-up de proteção 10 e meta concluída 25. Uma função SQL valida a propriedade do evento de origem e aplica cada crédito uma única vez. O nível é `floor(XP / 100) + 1`; a barra mostra o restante até 100 XP. Recaídas não alteram esse histórico.

## SOS

A sessão é criada ao iniciar e finalizada com intensidade final, duração e estratégias. Se a persistência falhar, o protocolo visual continua disponível. Conteúdo do SOS usa uma motivação e uma atividade cadastradas pelo próprio usuário.

## Accountability

Convites usam 32 bytes aleatórios. Somente SHA-256 é persistido, com expiração de sete dias e uso único. Permissões ficam em JSONB e diário inicia como `false`. O parceiro não recebe acesso direto irrestrito aos dados; novos snapshots compartilhados devem passar por funções SQL que validem relacionamento ativo e permissão por recurso.

## Offline

O service worker nunca armazena respostas privadas de `/app/*`. A página offline e ativos públicos podem ser cacheados. A sincronização futura usará IndexedDB criptografável, fila com `created_at/client_id` e política last-write-wins apenas para rascunhos não conflitantes.

## Interface e tema

O shell responsivo concentra navegação, alternância de tema e viewport de toasts. `Registros` é uma área principal e permanece ativa durante os fluxos de momento, impulso legado e recomeço. Em telas móveis, a barra fixa prioriza Início, Registros, Progresso e SOS; Diário, Perfil e ferramentas secundárias ficam no painel “Mais”. No desktop, a barra lateral reduz espaçamentos conforme a altura disponível para não ocultar ações em notebooks. A preferência de tema é aplicada imediatamente no cliente e persistida no perfil do usuário. CSS variables representam superfícies, texto, bordas e acentos para evitar divergências entre claro/escuro; animações devem respeitar `prefers-reduced-motion`.

## Evolução

Integrações futuras (extensões, DNS, iOS nativo) devem implementar adaptadores atrás de contratos de `ProtectionProvider`, sem alterar o modelo central de eventos.
