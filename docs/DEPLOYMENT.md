# Deploy

O Sentinel pode ser hospedado em qualquer ambiente compatível com Next.js. A combinação mais simples é uma plataforma Node/Next.js para o frontend e um projeto Supabase gerenciado para banco e autenticação.

## Preparação do Supabase

1. Crie projetos separados para staging e produção.
2. Aplique todas as migrations de `supabase/migrations` na ordem.
3. Confirme RLS e execute testes com contas distintas.
4. Configure URLs permitidas do Auth, URL principal e callbacks HTTPS.
5. Ajuste política de e-mail, SMTP e limites de autenticação.
6. Habilite backups e defina retenção apropriada.

Não execute `supabase/seed.sql` nem `npm run db:demo` em produção.

## Variáveis da aplicação

Configure no provedor de hospedagem:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `SUPABASE_SERVICE_ROLE_KEY`, somente se a funcionalidade administrativa que a usa estiver habilitada

Variáveis `NEXT_PUBLIC_*` são incorporadas ao bundle e não são secretas. A `service_role` é secreta e deve existir apenas no runtime do servidor.

## Checklist de release

- [ ] `npm ci` e `npm run check` passam em ambiente limpo.
- [ ] Testes E2E críticos passam em staging.
- [ ] Migrations foram revisadas, aplicadas e verificadas.
- [ ] URLs de redirect do Supabase apontam para HTTPS correto.
- [ ] Tema claro/escuro e desktop/mobile foram revisados.
- [ ] Manifesto, ícones, service worker e página offline foram validados.
- [ ] Logs não contêm conteúdo sensível.
- [ ] CSP e cabeçalhos foram verificados no domínio final.
- [ ] Monitoramento, backups e canal privado de segurança estão configurados.
- [ ] Uma licença foi escolhida antes de abrir o código ao público.

## Pós-deploy

Teste cadastro, confirmação de e-mail, login, recuperação de senha, check-in, resultado, SOS, alteração de tema, exportação e exclusão da conta. Verifique também uma conta sem dados e uma conta com histórico.

## Rollback

Prefira migrations compatíveis com a versão anterior do aplicativo. Em falha do frontend, reverta o deploy. Em falha de banco, use uma migration corretiva; não edite uma migration já aplicada. Alterações destrutivas exigem backup restaurável e procedimento ensaiado em staging.
