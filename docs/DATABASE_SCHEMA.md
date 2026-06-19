# DATABASE_SCHEMA — Harmoni Care

> Mantido pelo agente `backend-data`. Postgres via Supabase. Toda tabela de domínio tem `tenant_id` + RLS.

## Convenções
- PK: `id uuid default gen_random_uuid()`.
- Toda tabela de domínio: `tenant_id uuid not null references clinics(id)`.
- Timestamps: `created_at`, `updated_at` (trigger).
- Soft delete: `deleted_at` quando exigir retenção/auditoria.
- Índices em toda FK e em colunas de filtro frequentes.

## Tabelas (modelo inicial — refinar na implementação)
- `clinics` — tenant raiz (nome, plano, config).
- `users` / `profiles` — vínculo a `clinics`, papel (`admin`/`profissional`/`recepcao`).
- `patients` — dados do paciente (sensível). `tenant_id`.
- `professionals` — profissionais da clínica.
- `appointments` — agenda (paciente, profissional, status, horário). `tenant_id`.
- `medical_records` — prontuários (sensível, criptografia/auditoria). `tenant_id`.
- `record_access_log` — auditoria de acesso a prontuário (quem, quando, qual).
- `invoices` / `payments` — financeiro. `tenant_id`.
- `fiscal_notes` — NFS-e. `tenant_id`.
- `teleconsultations` — sessões de vídeo (metadados, não a mídia).

## RLS (padrão por tabela de domínio)
```sql
alter table <t> enable row level security;
create policy tenant_isolation on <t>
  using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```
> Refinar com papéis (ex.: recepção não lê prontuário clínico completo).

## Relações principais
clinics 1—N users · clinics 1—N patients · patients 1—N appointments · appointments 1—1 medical_record · clinics 1—N invoices.

## Pendências
- [ ] Definir criptografia adicional de campos clínicos.
- [ ] Política de retenção LGPD por tabela.
- [ ] Estratégia de backup e PITR (Supabase).
