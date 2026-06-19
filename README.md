# Harmoni Care

SaaS B2B multi-tenant de gestão de clínicas de saúde multidisciplinares.

> ⚠️ App de saúde sob LGPD (dados sensíveis). Segurança e isolamento de tenant são pré-requisito de cada commit. Ver [`docs/SECURITY_GUIDELINES.md`](docs/SECURITY_GUIDELINES.md).

## Stack
TypeScript monorepo (Turborepo + pnpm) · Next.js 15 (web) · Expo/React Native (mobile, equipe) · Supabase/Postgres (RLS).

## Estrutura
```
apps/web         # Next.js 15 (App Router)
apps/mobile      # Expo (a adicionar)
packages/core    # tipos, Zod, regras puras
packages/ui      # design tokens + componentes
packages/api-client  # cliente Supabase tipado
docs/            # documentação do projeto
.claude/         # agentes e comandos do Claude Code
```

## Comandos
```bash
pnpm install      # instalar deps
pnpm dev          # rodar em desenvolvimento
pnpm typecheck    # checagem de tipos
pnpm build        # build de produção
pnpm test         # testes
```

## Documentação
Comece por [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`docs/ROADMAP.md`](docs/ROADMAP.md).
Operação de agentes: [`AGENTS.md`](AGENTS.md).
