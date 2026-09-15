# Publicação no GitHub

O repositório local está preparado para usar `main` como branch principal. Arquivos locais, builds, caches e segredos estão excluídos por `.gitignore`.

## Antes do primeiro push

1. Decida se o repositório será privado ou público. Mantenha-o privado até escolher uma licença e um canal de segurança.
2. Se for público, adicione um arquivo `LICENSE` compatível com o uso pretendido.
3. Defina um canal privado em `SECURITY.md` ou habilite GitHub Security Advisories.
4. Crie um repositório vazio no GitHub, sem README ou `.gitignore` gerados pelo site.
5. Revise o resultado de `git status --short --ignored` e `git add --dry-run .`.

## Primeiro commit e envio

Substitua a URL abaixo pela URL real do repositório:

```bash
git add .
git commit -m "feat: publica versão inicial do Sentinel"
git remote add origin https://github.com/SEU_USUARIO/sentinel.git
git push -u origin main
```

Não execute esses comandos até revisar a lista completa de arquivos. `.env.local`, `.next`, `node_modules`, resultados de teste e estado local do Supabase não devem aparecer.

## Configurações recomendadas no GitHub

- Defina `main` como branch padrão.
- Proteja `main`: pull request obrigatório e jobs `quality` e `database` aprovados.
- Habilite Dependabot alerts, secret scanning e push protection quando disponíveis.
- Habilite Security Advisories para relatos privados.
- Limite ações do GitHub a workflows e actions confiáveis.
- Defina descrição, tópicos e URL do deploy sem mencionar promessas clínicas.
- Configure environments separados para staging e produção.

## Secrets e deploy

Segredos de deploy pertencem ao provedor de hospedagem ou a GitHub Environments, nunca ao repositório. Variáveis `NEXT_PUBLIC_*` são públicas no bundle; a chave `SUPABASE_SERVICE_ROLE_KEY` deve ser restrita ao servidor.

## Releases

Use tags semânticas quando houver estabilidade de release (`v0.1.0`, `v0.2.0`). Atualize `CHANGELOG.md`, valide migrations e crie uma release com instruções de deploy/rollback.
