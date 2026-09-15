# Segurança

## Dados sensíveis e ameaças

Check-ins, impulsos, recaídas, motivações e diário são dados altamente sensíveis. As ameaças principais são acesso horizontal entre contas, compartilhamento excessivo com parceiro, vazamento em logs/notificações, roubo de convite e exposição no app switcher.

## Controles

- RLS está ativa em todas as tabelas pessoais; políticas de proprietário comparam `auth.uid()` ao `user_id`.
- Server Actions tratam entrada como não confiável, revalidam a sessão e não aceitam propriedade enviada pelo cliente.
- Tokens de convite usam CSPRNG, expiram em sete dias, são usados uma vez e ficam armazenados apenas como hash.
- Service role existe somente no servidor e apenas para excluir o usuário do Auth.
- Diário não é compartilhado por padrão; accountability possui permissões independentes e revogação imediata.
- Cabeçalhos removem framing, sniffing e APIs de câmera, microfone e geolocalização.
- O aplicativo não coleta GPS. Notificações devem ter texto neutro.

## Logging

Logs podem conter request id, rota, status, timestamp e erro técnico normalizado. Nunca registrar corpo de diário, motivação, pensamento, detalhes de recaída, token de convite, cookies ou chaves.

## CSP

A CSP estrita deve ser validada no ambiente final porque Next.js pode exigir nonce em scripts. Antes da produção, configure `script-src` com nonce por requisição, `connect-src` apenas para a origem Supabase e elimine qualquer necessidade de `unsafe-eval`.

## Rate limit e abuso

Supabase Auth protege os endpoints de autenticação conforme configuração do projeto. Convites e pedidos de apoio devem receber limite por usuário e janela em produção. A arquitetura permite Turnstile/hCaptcha se houver abuso, sem impor CAPTCHA no MVP.

## Exclusão e retenção

Excluir o usuário Auth aciona `ON DELETE CASCADE` para dados privados. Relacionamentos usam regras explícitas e convites são invalidados. Exportações usam `no-store` e omitem hashes e tokens.

## Relato de vulnerabilidade

Não abra issue pública com dados sensíveis. Envie um relato privado ao responsável pelo deploy, incluindo impacto, passos mínimos e ambiente afetado.
