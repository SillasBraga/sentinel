# Documentação do Sentinel

Este diretório concentra decisões técnicas, instruções operacionais e contexto do produto. Mantenha estes documentos sincronizados com mudanças relevantes no código.

## Para começar

- [SETUP.md](SETUP.md): ambiente local, Supabase e usuário demo.
- [ARCHITECTURE.md](ARCHITECTURE.md): componentes, fronteiras e fluxos de dados.
- [DATABASE.md](DATABASE.md): migrations, RLS, tipos e operação do banco.
- [TESTING.md](TESTING.md): estratégia e comandos de validação.
- [DEPLOYMENT.md](DEPLOYMENT.md): checklist de produção e rollback.
- [GITHUB.md](GITHUB.md): publicação inicial e configurações do repositório.

## Segurança e manutenção

- [SECURITY.md](SECURITY.md): ameaças, controles e dados sensíveis.
- [AI_GUIDE.md](AI_GUIDE.md): contexto e regras para agentes de IA.
- [ROADMAP.md](ROADMAP.md): escopo atual e possíveis evoluções.

## Fonte da verdade

Em divergências, o comportamento testado do código e as migrations já aplicadas são a fonte operacional de verdade. Atualize a documentação no mesmo pull request que mudar contratos, comandos, dados, segurança ou experiência do usuário.
