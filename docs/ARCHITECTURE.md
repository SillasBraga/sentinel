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

`recovery_profiles.started_at` e `relapse_events` formam o histórico de eventos. Streak atual, recorde e dias alinhados são derivados; uma recaída nunca sobrescreve o histórico. Datas de calendário são convertidas para o fuso do perfil antes do cálculo, evitando dividir milissegundos por 24 horas.

O risk engine é uma função pura que soma contribuições explícitas e retorna `{ score, level, factors }`. A interface mostra os fatores e não faz previsões deterministas. Insights exigem amostra mínima.

Após um check-in, o usuário é encaminhado ao resultado explicativo, que relaciona o registro aos indicadores sem prometer causalidade clínica. Inserções, alterações e exclusões usam um contrato compartilhado de resultado e toasts temporários para tornar o estado da operação visível.

## SOS

A sessão é criada ao iniciar e finalizada com intensidade final, duração e estratégias. Se a persistência falhar, o protocolo visual continua disponível. Conteúdo do SOS usa uma motivação e uma atividade cadastradas pelo próprio usuário.

## Accountability

Convites usam 32 bytes aleatórios. Somente SHA-256 é persistido, com expiração de sete dias e uso único. Permissões ficam em JSONB e diário inicia como `false`. O parceiro não recebe acesso direto irrestrito aos dados; novos snapshots compartilhados devem passar por funções SQL que validem relacionamento ativo e permissão por recurso.

## Offline

O service worker nunca armazena respostas privadas de `/app/*`. A página offline e ativos públicos podem ser cacheados. A sincronização futura usará IndexedDB criptografável, fila com `created_at/client_id` e política last-write-wins apenas para rascunhos não conflitantes.

## Interface e tema

O shell responsivo concentra navegação, alternância de tema e viewport de toasts. A preferência de tema é aplicada imediatamente no cliente e persistida no perfil do usuário. CSS variables representam superfícies, texto, bordas e acentos para evitar divergências entre claro/escuro; animações devem respeitar `prefers-reduced-motion`.

## Evolução

Integrações futuras (extensões, DNS, iOS nativo) devem implementar adaptadores atrás de contratos de `ProtectionProvider`, sem alterar o modelo central de eventos.
