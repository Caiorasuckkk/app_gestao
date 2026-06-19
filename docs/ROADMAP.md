# ROADMAP — Harmoni Care

## Fase 0 — Fundação (1–2 semanas)
- Docs e decisões (este conjunto).
- Monorepo (Turborepo + pnpm), apps web/mobile vazios, packages base.
- CI: lint + typecheck + test + build.
- Design tokens extraídos do Figma + componentes base.
- Agentes configurados (.claude/agents).
- **Aceite:** `pnpm build` e CI verdes; tokens em `packages/ui`.

## Fase 1 — MVP núcleo (3–5 semanas)
- Supabase: schema base + RLS multi-tenant + Auth + papéis.
- Pacientes (CRUD), Agenda, Prontuários (web).
- Mobile da equipe: login + agenda + pacientes.
- **Aceite:** fluxo clínica → profissional → paciente → consulta → prontuário, com isolamento de tenant testado.

## Fase 2 — Operação clínica (3–4 semanas)
- Teleconsulta (integração Daily/Twilio).
- Financeiro (cobranças/pagamentos).
- Relatórios essenciais.
- **Aceite:** consulta por vídeo + cobrança funcionando ponta-a-ponta.

## Fase 3 — Fiscal & escala (3–4 semanas)
- Notas Fiscais (NFS-e).
- Observabilidade, hardening de segurança, performance.
- **Aceite:** emissão de NFS-e + `/security-review` sem críticos.

## Fase 4 — Lançamento
- Deploy web produção, builds de loja, revisão final.
- **Aceite:** QA_CHECKLIST 100%, smoke test produção ok.

## Critérios de aceite (padrão)
Toda entrega: estados de erro tratados, validação no servidor, isolamento de tenant testado, sem segredo exposto, revisão de código e (se sensível) de segurança.
