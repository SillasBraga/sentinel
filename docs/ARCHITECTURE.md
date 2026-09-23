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

Após registrar uma recaída, o fluxo abre um plano de retomada privado ligado ao evento. Ele convida a registrar o ocorrido, a barreira que falhou, uma ação para as próximas 24 horas e uma missão leve para amanhã. O último plano permanece acessível em **Retomada**, no menu de ferramentas, e em **Progresso**. As respostas são opcionais, não alteram XP, missões ou sequência e não são compartilhadas por accountability.

Entradas do diário são privadas e podem ser editadas ou excluídas pelo proprietário, sempre com confirmação antes da exclusão. O XP de reflexão, se já concedido, permanece como histórico de presença e não é removido ao alterar ou excluir a nota.

O calendário cruza check-ins, conclusões de hábitos, impulsos, sessões SOS, metas e recomeços pelo fuso horário do perfil. A grade mensal é navegável, inclui filtros locais e exibe apenas resumos no detalhe diário; textos íntimos de recaídas, impulsos e diário não são reproduzidos nessa visão agregada.

As missões diárias usam `daily_missions`, indexada por usuário e data civil no fuso do perfil. Check-in e primeira conclusão de hábito do dia sincronizam o estado automaticamente; o power-up de proteção é uma confirmação explícita do usuário. A conclusão não altera a sequência de recuperação nem compartilha dados com accountability.

O objetivo do dia é um único texto em `daily_focuses`, isolado por usuário e data civil. A Base permite defini-lo, atualizá-lo ou marcá-lo como concluído; ele serve como lembrete privado e não altera métricas, XP ou sequência.

Zonas de atenção são desafios privados em `attention_zones`. Um registro de impulso pode associar uma zona e a estratégia usada; a página agrega somente os próprios registros para mostrar frequência, contexto e estratégia mais frequente, com atalhos para SOS e power-up.

Power-ups reutilizam `alternative_activities` como equipamento da jornada. A conclusão escreve um evento imutável, atualiza a missão diária de proteção e usa o crédito de XP de proteção já existente, limitado ao primeiro power-up do dia.

XP de presença é um histórico imutável em `presence_xp_events`: check-in rende 15 XP, hábito 10, SOS concluído 20, reflexão no diário 10, power-up de proteção 10 e meta concluída 25. Uma função SQL valida a propriedade do evento de origem e aplica cada crédito uma única vez. O desafio cresce a cada nível: nível 1 exige 100 XP, nível 2 exige 200 XP, nível 3 exige 300 XP, e assim sucessivamente. Ao alcançar um novo nível, o shell protegido mostra uma celebração em qualquer tela; recaídas não alteram esse histórico.

Marcos privados usam o catálogo `achievements` e o histórico imutável `user_achievements`. A função SQL autenticada avalia primeiro check-in, sete dias com check-in, três SOS concluídos, cinco check-ins em sete dias e recomeço consciente. Somente o dono pode ler marcos conquistados; a interface não tem ranking, competição, monetização ou compartilhamento com accountability.

## SOS

A sessão é criada ao iniciar e finalizada com intensidade final, duração e estratégias. Se a persistência falhar, o protocolo visual continua disponível. Conteúdo do SOS usa uma motivação e uma atividade cadastradas pelo próprio usuário.

## Aliado

Convites usam 32 bytes aleatórios. Somente SHA-256 é persistido, com expiração de sete dias e uso único. Permissões ficam em JSONB e diário inicia como `false`. O aliado não recebe acesso direto irrestrito aos dados; novos snapshots compartilhados devem passar por funções SQL que validem relacionamento ativo e permissão por recurso. Pedidos de apoio usam mensagens neutras predefinidas e exigem permissão específica.

## Offline

O service worker nunca armazena respostas privadas de `/app/*`. A página offline e ativos públicos podem ser cacheados. A sincronização futura usará IndexedDB criptografável, fila com `created_at/client_id` e política last-write-wins apenas para rascunhos não conflitantes.

## Interface e tema

O shell responsivo concentra navegação, alternância de tema e viewport de toasts. As cinco áreas principais são **Base**, **Jornada**, **Registrar**, **SOS** e **Perfil** em desktop e mobile; Registrar tem destaque visual. Em desktop, a barra lateral separa Navegação de Equipamento, exibe a missão atual e pode rolar em alturas pequenas sem ocultar itens. Rituais, Objetivos, Mapa, Plano e Defesas fazem parte do equipamento; Perfil também organiza esses acessos. No mobile, somente o conteúdo da rota rola e a barra fixa não cobre a última ação. A Base é uma Central de Jornada: missão diária, três missões, ações de check-in/recomeço/SOS, sequência compacta, energia e radar de atenção. A sequência significa somente dias sem recaída registrada; um recomeço preserva eventos, XP, hábitos, SOS e conquistas. A preferência de tema é aplicada imediatamente no cliente e persistida no perfil do usuário. Em Perfil, ambientes visuais são desbloqueados somente por XP acumulado, aplicados sem refresh e persistidos no perfil; não há moedas, compras, caixas aleatórias ou pressão de prazo. CSS variables representam superfícies, texto, bordas e acentos para evitar divergências entre claro/escuro; animações devem respeitar `prefers-reduced-motion`.

## Evolução

Integrações futuras (extensões, DNS, iOS nativo) devem implementar adaptadores atrás de contratos de `ProtectionProvider`, sem alterar o modelo central de eventos.
