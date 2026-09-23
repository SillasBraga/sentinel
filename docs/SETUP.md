# Configuração local

## 1. Requisitos

- Node.js 24+
- npm 10+
- Git
- Docker Desktop em execução

O arquivo `.nvmrc` fixa a família do Node usada pelo CI. Em ambientes com NVM, execute `nvm use`.

## 2. Dependências

```bash
npm ci
```

Use `npm ci` em máquinas limpas e no CI para respeitar exatamente o `package-lock.json`.

## 3. Supabase local

```bash
npm run db:start
npm run db:reset
npx supabase status
```

O último comando informa a API URL, a chave `anon` e a chave `service_role`. Copie `.env.example` para `.env.local` e preencha:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:<porta-da-api>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-anon-local>
SUPABASE_SERVICE_ROLE_KEY=<service-role-local>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Não use chaves de produção no ambiente local. `.env.local` é ignorado pelo Git.

## 4. Aplicação e usuário demo

```bash
npm run db:demo
npm run dev
```

Credenciais locais padrão:

- Jornada: `demo@sentinel.local` / `SentinelDemo2026!`
- Aliado: `ally@sentinel.local` / `AllyDemo2026!`

Use contas em navegadores ou perfis separados para testar convites de Aliado. O script é idempotente e destinado exclusivamente ao projeto Supabase local.

## 5. URLs locais

As portas do Supabase são definidas em `supabase/config.toml`. Consulte `npx supabase status` porque elas podem mudar. A aplicação usa `http://localhost:3000` por padrão.

## Problemas comuns

### “Supabase não configurado”

Confirme que `.env.local` existe, que as variáveis públicas não estão vazias e reinicie `npm run dev` após alterá-las.

### Docker ou Supabase não inicia

Abra o Docker Desktop, verifique conflitos nas portas de `supabase/config.toml` e rode `npx supabase stop` antes de tentar novamente.

### Tipos do banco divergentes

```bash
npm run db:reset
npm run db:types
npm run typecheck
```

Revise o diff do arquivo gerado antes de commitar.
