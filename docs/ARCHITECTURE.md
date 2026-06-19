# ARCHITECTURE — Harmoni Care

## Visão geral
Monorepo TypeScript (Turborepo + pnpm). Web em Next.js, mobile em Expo, dados em Supabase/Postgres. Código compartilhado em `packages/`.

## Camadas
1. **UI** (`apps/web`, `apps/mobile`) — apresentação. Sem regra de negócio.
2. **Compartilhado** (`packages/`)
   - `ui` — design tokens e componentes.
   - `core` — tipos, validação Zod, regras de negócio puras (testáveis).
   - `api-client` — cliente Supabase/API tipado.
   - `config` — eslint/tsconfig/tailwind preset.
3. **Serviço/Negócio** — route handlers / server actions (web) e edge functions (Supabase). Lógica crítica (fiscal/financeira) aqui, não em RLS.
4. **Dados** — Postgres via Supabase. RLS aplica isolamento de tenant.

## Multi-tenant (decisão central)
- Modelo: **shared database, shared schema** com `tenant_id` (clinic_id) em toda tabela de domínio + **RLS**.
- O `tenant_id` do usuário vem do JWT/sessão; políticas RLS filtram por ele.
- Toda nova tabela exige política RLS + teste cross-tenant antes de ir para produção.

## Autenticação e papéis
- Supabase Auth. Papéis: `admin`, `profissional`, `recepcao` (e futuramente `paciente`).
- Autorização por papel + tenant na camada de serviço e na RLS.

## Integrações externas
- Teleconsulta: Daily/Twilio (SDK embarcado).
- Pagamentos/NFS-e: Asaas/Pagar.me (Brasil) ou Stripe.
- Observabilidade: Sentry (erros), PostHog (produto).

## Decisões registradas (ADR resumido)
- **ADR-001 Stack:** TS monorepo (Next.js + Expo) + Supabase. Motivo: web-first denso, reuso de design React, time pequeno, Postgres relacional + RLS para multi-tenant.
- **ADR-002 DB:** Postgres (não Firestore). Motivo: dados relacionais de saúde, queries/relatórios, RLS, custo em escala.
- **ADR-003 Figma export:** referência visual, reconstruir limpo. Motivo: evitar dívida técnica do protótipo.
- **ADR-004 Features reguladas:** comprar (vídeo/NFS-e/pagamento), não construir.

> Registre novas decisões estruturais como ADR-00N aqui antes de implementar.
