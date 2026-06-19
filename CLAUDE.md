# CLAUDE.md — Harmoni Care

> Este arquivo é carregado automaticamente em toda sessão e por todos os subagents.
> É a fonte de verdade das regras de desenvolvimento. Mantenha-o curto e atual.

## O produto
**Harmoni Care** é um SaaS B2B **multi-tenant** de gestão de clínica de saúde multidisciplinar.
Módulos: Agenda, Pacientes, Prontuários, Teleconsulta, Financeiro, Notas Fiscais, Equipes, Relatórios, Configurações.

**Dados de saúde = dados sensíveis sob a LGPD (art. 11).** Segurança e isolamento de tenant não são features — são pré-requisitos de cada commit.

## Stack (decidida)
- Monorepo: **Turborepo + pnpm**, **TypeScript** ponta-a-ponta.
- Web (surface primária): **Next.js 15 (App Router)**.
- Mobile (equipe da clínica): **Expo (React Native)**, builds via EAS.
- UI: design tokens compartilhados + **shadcn/ui** (web). Sem MUI no código de produção.
- Validação: **Zod** (cliente e servidor).
- Dados/Auth/Storage: **Supabase (Postgres + Auth + Storage + RLS)**, região São Paulo (LGPD).
- Lógica de negócio crítica: route handlers / server actions / edge functions (subir para NestJS quando crescer). Nunca só em RLS.
- Integrações: Teleconsulta = Daily/Twilio (não construir WebRTC). Pagamentos/NFS-e = Asaas/Pagar.me ou Stripe.
- Hosting: Vercel (web) + Supabase (dados) + EAS (mobile). Obs: Sentry + PostHog.

## Regras de desenvolvimento (valem para todo agente)
1. Pense em **produção real**. Sem gambiarra, sem código morto ou duplicado.
2. **Multi-tenant:** toda tabela de domínio tem `tenant_id` (clinic_id) + política RLS. Nunca confie só na aplicação para isolar.
3. **LGPD:** nunca logue dado sensível. Auditoria de acesso a prontuário. Base legal e retenção documentadas.
4. **Segredos** só em variáveis de ambiente — nunca no código nem no client bundle.
5. **Validação no servidor** sempre (Zod), mesmo que o cliente valide.
6. Código limpo, modular, tipado. Separe camadas e responsabilidades.
7. Ao **gerar código**, indique o caminho exato do arquivo.
8. Ao **alterar código existente**, explique o que mudou, por quê, e valide que não quebra nada.
9. Antes de **mudanças grandes**, descreva impacto e riscos primeiro.
10. Explique decisões técnicas importantes; registre as estruturais em `docs/ARCHITECTURE.md` (ADR).
11. Preserve **fidelidade visual** com o Figma usando os tokens do design system (sem hex/valor mágico solto).

## O export do Figma é referência, não produção
A pasta "Landing page Harmoni Care" (Figma Make: Vite+MUI+Radix) é **fonte de referência visual**. Minere tokens e layout; reconstrua limpo no monorepo. Não construa produção em cima dela.

## Documentação (leia o doc relevante antes de agir)
- `docs/PROJECT_OVERVIEW.md` — produto, personas, escopo.
- `docs/ARCHITECTURE.md` — arquitetura, camadas, multi-tenant, ADRs.
- `docs/DESIGN_SYSTEM.md` — tokens e componentes.
- `docs/DATABASE_SCHEMA.md` — tabelas, relações, RLS, índices.
- `docs/SECURITY_GUIDELINES.md` — LGPD, auth, secrets, rate limit.
- `docs/DEPLOYMENT.md` — ambientes, CI/CD, env, lojas.
- `docs/QA_CHECKLIST.md` — checklist de produção.
- `docs/ROADMAP.md` — MVP e fases.
- `AGENTS.md` — quando usar cada agente.

## Agentes disponíveis
`design-system`, `frontend-web`, `mobile`, `backend-data`, `security-reviewer`, `code-reviewer`, `qa-tester`.
Coordenação é responsabilidade do thread principal (Arquiteto/PM), não de um subagent. Ver `AGENTS.md`.
