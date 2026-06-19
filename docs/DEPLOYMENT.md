# DEPLOYMENT — Harmoni Care

## Ambientes
- **development** — local + Supabase local/branch.
- **staging** — Vercel preview + projeto Supabase de staging.
- **production** — Vercel produção + Supabase produção (região São Paulo).

## Variáveis de ambiente
- Nunca commitadas. `.env.example` documenta as chaves.
- Públicas (client): apenas `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` (anon key Supabase, URLs).
- Secretas (server): service role, chaves de pagamento/NFS-e/vídeo, Sentry DSN server.

## CI/CD (GitHub Actions)
- PR: `lint` + `typecheck` + `test` + `build` (Turborepo). Bloqueia merge se falhar.
- Migrations: aplicadas via Supabase CLI em pipeline (staging → produção), reversíveis.
- Web: deploy automático Vercel (preview por PR, produção no merge em `main`).
- Mobile: build via **EAS**; submissão às lojas controlada (não automática no início).

## Web (Vercel)
- Domínio, SSL, headers de segurança, analytics.
- Smoke test pós-deploy.

## Mobile (lojas)
- **Play Store / App Store**: contas de desenvolvedor, fichas, política de privacidade (obrigatória — app de saúde), classificação etária, screenshots.
- Atenção a políticas de apps de saúde (declaração de dados, permissões justificadas).
- Versionamento e canais (internal/beta/produção).

## Rollback
- Web: revert de deploy na Vercel.
- DB: migrations reversíveis + backup/PITR Supabase antes de mudança destrutiva.

## Checklist de deploy
- [ ] Migrations testadas em staging.
- [ ] Env vars de produção conferidas (sem secret faltando/exposto).
- [ ] `/security-review` e `QA_CHECKLIST` ok.
- [ ] Sentry/observabilidade ativos.
- [ ] Smoke test pós-deploy.
