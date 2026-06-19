---
description: Cria uma migration Supabase com RLS multi-tenant e atualiza o schema doc
---
Crie a migration para: $ARGUMENTS

Use o agente `backend-data`:
- SQL versionado e reversível em `supabase/migrations`.
- Toda tabela de domínio com `tenant_id` + política RLS de isolamento.
- Índices em FKs e colunas de filtro, com justificativa.
- Validação Zod correspondente em `packages/core`.
- Atualize `docs/DATABASE_SCHEMA.md`.
- Explique impacto e como aplicar sem downtime.
Ao final, lembre de um teste cross-tenant (agente `qa-tester`).
