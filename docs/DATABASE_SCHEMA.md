# DATABASE_SCHEMA — Harmoni Care

> Mantido pelo agente `backend-data`. Postgres via Supabase. Toda tabela de domínio tem `clinic_id` (tenant_id) + RLS.
> Atualizado em: 2026-06-19 (migration 0001_init — revisão de segurança auditoria RLS).

---

## Convenções

- PK: `id uuid primary key default gen_random_uuid()`.
- Toda tabela de domínio: `clinic_id uuid not null references clinics(id)`.
- Timestamps: `created_at timestamptz not null default now()`, `updated_at` com trigger `set_updated_at()`.
- Soft delete: `deleted_at timestamptz` quando a tabela exigir retenção/auditoria (ex.: patients).
- Índices obrigatórios em toda FK e em colunas de filtro frequentes.
- Nenhum dado sensível (cpf, email, phone, notes clínicos) deve aparecer em logs de aplicação ou banco.
- `FORCE ROW LEVEL SECURITY` em todas as tabelas de domínio: protege mesmo sob roles privilegiadas não-service_role.
- `REVOKE ALL FROM anon` em todas as tabelas: dados de saúde nunca acessíveis sem autenticação.

---

## Enums

### `user_role`
| Valor | Descrição |
|---|---|
| `admin` | Gestor da clínica; acesso total ao tenant |
| `profissional` | Profissional de saúde; acesso a prontuários; pode ser professional_id em appointments |
| `recepcao` | Recepcionista; agenda e dados básicos de pacientes; NÃO pode ser professional_id |

### `appointment_status`
| Valor | Descrição |
|---|---|
| `agendado` | Criado, aguardando confirmação |
| `confirmado` | Confirmado pela clínica ou paciente |
| `cancelado` | Cancelado por qualquer parte |
| `realizado` | Atendimento concluído |

---

## Tabelas (Fase 1 — núcleo)

### `clinics` — tenant raiz
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() |
| `name` | text | not null, length 2–200 |
| `created_at` | timestamptz | not null, default now() |
| `updated_at` | timestamptz | not null, default now(), trigger |

- Sem `clinic_id` — esta tabela *é* o tenant.
- RLS: `FORCE ROW LEVEL SECURITY`; `REVOKE ALL FROM anon`; `GRANT SELECT TO authenticated`.
- INSERT/UPDATE/DELETE por usuário normal bloqueados por default (service role apenas).

### `profiles` — usuários da clínica
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | uuid | PK, FK `auth.users(id)` on delete cascade |
| `clinic_id` | uuid | not null, FK `clinics(id)` on delete restrict |
| `role` | user_role | not null, default `recepcao` |
| `full_name` | text | not null, length 2–200, dado pessoal |
| `created_at` | timestamptz | not null, default now() |

- `id` = `auth.uid()` — um usuário pertence a exatamente uma clínica.
- `full_name` é dado pessoal (LGPD) — não logar.
- `role` e `clinic_id` NÃO podem ser alterados via UPDATE direto por usuário comum (policy `profiles_self_update` verifica que estes campos permanecem inalterados).
- Mudança de `role`: somente via função RPC `update_member_role(target_id, new_role)` por admin do mesmo tenant.

**Índices:**
| Nome | Colunas | Observação |
|---|---|---|
| `idx_profiles_clinic_id` | `(clinic_id)` | Listagem de membros por tenant e lookup de `auth_clinic_id()` |
| `uq_profiles_id_clinic` | `(id, clinic_id)` UNIQUE | Permite FK composta de appointments; garante coerência de tenant |

**RLS:** `FORCE ROW LEVEL SECURITY`; `REVOKE ALL FROM anon`; `GRANT SELECT, INSERT, UPDATE TO authenticated`.

### `patients` — pacientes
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() |
| `clinic_id` | uuid | not null, FK `clinics(id)` on delete restrict |
| `full_name` | text | not null, length 2–200, dado pessoal sensível |
| `birth_date` | date | nullable |
| `cpf` | text | nullable, regex `^\d{11}$`, dígito verificador (Zod), dado sensível |
| `email` | text | nullable, formato e-mail, dado pessoal |
| `phone` | text | nullable, length 8–20, dado pessoal |
| `created_at` | timestamptz | not null, default now() |
| `updated_at` | timestamptz | not null, default now(), trigger |
| `deleted_at` | timestamptz | nullable — soft delete |

- Dado sensível LGPD art. 11. Nunca logar `cpf`, `email`, `phone`, `full_name`.
- Soft delete via `deleted_at`; retenção mínima 20 anos (CFM). Purga física via processo DPO.
- Hard delete bloqueado por RLS (`using (false)`).

**Índices:**
| Nome | Colunas | Observação |
|---|---|---|
| `idx_patients_clinic_id` | `(clinic_id)` | Filtro de tenant em todos os selects |
| `idx_patients_clinic_active` | `(clinic_id, deleted_at) WHERE deleted_at IS NULL` | Listagem de pacientes ativos |
| `idx_patients_clinic_cpf` | `(clinic_id, cpf) WHERE cpf IS NOT NULL` UNIQUE | UNIQUE por tenant; evita fingerprinting cross-tenant |
| `uq_patients_id_clinic` | `(id, clinic_id)` UNIQUE | Permite FK composta de appointments; garante coerência de tenant |

**RLS:** `FORCE ROW LEVEL SECURITY`; `REVOKE ALL FROM anon`; `GRANT SELECT, INSERT, UPDATE TO authenticated`.

### `appointments` — agendamentos
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() |
| `clinic_id` | uuid | not null, FK `clinics(id)` on delete restrict |
| `patient_id` | uuid | not null, FK composta `(patient_id, clinic_id)` → `patients(id, clinic_id)` |
| `professional_id` | uuid | not null, FK composta `(professional_id, clinic_id)` → `profiles(id, clinic_id)` |
| `starts_at` | timestamptz | not null |
| `ends_at` | timestamptz | not null, check `ends_at > starts_at` |
| `status` | appointment_status | not null, default `agendado` |
| `notes` | text | nullable, potencialmente clínico — não logar |
| `created_at` | timestamptz | not null, default now() |

- FKs compostas garantem no banco que `patient_id` e `professional_id` pertencem ao mesmo `clinic_id` do agendamento (isolamento multi-tenant A1).
- Trigger `appointments_check_professional` (BEFORE INSERT/UPDATE) verifica que `professional_id` tem `role` = `profissional` ou `admin` (A2). `role = 'recepcao'` é rejeitado.
- Hard delete restrito a `admin` via policy `appointments_delete_admin_only` + `is_clinic_admin()` (B1).

**Índices:**
| Nome | Colunas | Observação |
|---|---|---|
| `idx_appointments_clinic_id` | `(clinic_id)` | Filtro de tenant |
| `idx_appointments_patient_id` | `(patient_id)` | Agenda por paciente |
| `idx_appointments_professional_id` | `(professional_id)` | Agenda por profissional |
| `idx_appointments_clinic_starts_at` | `(clinic_id, starts_at)` | Range de datas por tenant |
| `idx_appointments_clinic_status` | `(clinic_id, status)` | Listagem por status |

**RLS:** `FORCE ROW LEVEL SECURITY`; `REVOKE ALL FROM anon`; `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated` (DELETE filtrado pela policy admin-only).

---

## Relações

```
clinics 1 ──── N profiles
clinics 1 ──── N patients
clinics 1 ──── N appointments
patients 1 ──── N appointments   (via FK composta patient_id+clinic_id)
profiles 1 ──── N appointments   (via FK composta professional_id+clinic_id)
```

---

## RLS — Isolamento Multi-Tenant

### Mecanismo central: `auth_clinic_id()`

A abordagem anterior (`auth.jwt() ->> 'clinic_id'`) foi **descartada** por ser insegura: um cliente pode incluir claims arbitrários no JWT e influenciar o resultado, quebrando o isolamento de tenant.

A função adotada é:

```sql
create or replace function public.auth_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select clinic_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;
```

- `auth.uid()` é derivado pelo Supabase do JWT assinado com o segredo do projeto — não é forjável pelo cliente.
- `SECURITY DEFINER`: executa com privilégios do owner, não do chamador; o resultado não pode ser manipulado via search_path poisoning (protegido por `set search_path = ''`).
- `STABLE`: avaliada uma vez por statement (não por row), reduzindo overhead.

### Vetor de ataque bloqueado: tenant hopping por JWT forjado

Cenário de ataque sem `auth_clinic_id()`: um atacante com uma conta válida na clínica A edita o payload do JWT adicionando `"clinic_id": "<UUID da clínica B>"`. A política `using (clinic_id = (auth.jwt() ->> 'clinic_id')::uuid)` aceitaria o claim falso e retornaria dados da clínica B.

Com `auth_clinic_id()`: a função ignora qualquer claim de `clinic_id` presente no JWT. Ela faz um `SELECT` direto em `profiles` filtrando por `auth.uid()` — que o Supabase deriva do JWT assinado com o segredo do projeto e que o cliente não consegue forjar.

### Vetor de ataque bloqueado: auto-promoção de papel (privilege escalation)

Sem a proteção correta, qualquer usuário poderia fazer `UPDATE profiles SET role = 'admin' WHERE id = auth.uid()` e escalar privilégios. Dois mecanismos bloqueiam isso no banco:

1. **Policy `profiles_self_update`**: o `WITH CHECK` verifica via subquery que `role` e `clinic_id` permanecem idênticos aos valores atuais. Qualquer tentativa de alterar essas colunas falha na avaliação da policy.
2. **`update_member_role()` RPC SECURITY DEFINER**: canal único para mudança legítima de papel. Verifica `is_clinic_admin()` internamente, bloqueia auto-rebaixamento do admin, e garante cruzamento de tenant impossível.

### Políticas por tabela

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `clinics` | `id = auth_clinic_id()` | bloqueado (service role) | bloqueado | bloqueado |
| `profiles` | `clinic_id = auth_clinic_id()` | `id = auth.uid() AND clinic_id = auth_clinic_id()` | self: somente `full_name` (role/clinic_id imutáveis via policy) | bloqueado |
| `patients` | `clinic_id = auth_clinic_id()` | `clinic_id = auth_clinic_id()` | `clinic_id = auth_clinic_id()` (using + check) | `using (false)` — hard delete bloqueado |
| `appointments` | `clinic_id = auth_clinic_id()` | `clinic_id = auth_clinic_id()` | `clinic_id = auth_clinic_id()` (using + check) | `clinic_id = auth_clinic_id() AND is_clinic_admin()` |

---

## Funções e Triggers

| Objeto | Tipo | Finalidade |
|---|---|---|
| `public.set_updated_at()` | trigger function SECURITY INVOKER | Atualiza `updated_at` automaticamente antes de UPDATE |
| `public.auth_clinic_id()` | function STABLE SECURITY DEFINER | Retorna `clinic_id` do usuário autenticado; base de todas as políticas RLS |
| `public.is_clinic_admin()` | function STABLE SECURITY DEFINER | Retorna true se auth.uid() tem role=admin; usada em policies privilegiadas |
| `public.update_member_role(uuid, user_role)` | function SECURITY DEFINER | Canal único auditável para mudança de papel; somente admin do mesmo tenant |
| `public.check_professional_role()` | trigger function SECURITY INVOKER | Verifica que professional_id tem role profissional ou admin antes de INSERT/UPDATE em appointments |

Triggers aplicados:

| Trigger | Tabela | Evento | Função |
|---|---|---|---|
| `clinics_set_updated_at` | `clinics` | BEFORE UPDATE | `set_updated_at()` |
| `patients_set_updated_at` | `patients` | BEFORE UPDATE | `set_updated_at()` |
| `appointments_check_professional` | `appointments` | BEFORE INSERT OR UPDATE OF professional_id | `check_professional_role()` |

---

## LGPD — Base Legal e Retenção

| Tabela | Base legal (LGPD) | Retenção mínima |
|---|---|---|
| `patients` | Execução de contrato (art. 7º, V); tutela da saúde (art. 11, II, f) | 20 anos (CFM Res. 1.638/02) |
| `appointments` | Execução de contrato (art. 7º, V) | 5 anos (recomendação) |
| `profiles` | Execução de contrato (art. 7º, V) | Duração do contrato + 5 anos |

Purga definitiva de `patients` exige aprovação de DPO e execução via service role (não exposta ao usuário final).

---

## Tabelas planejadas (fases futuras)

| Tabela | Módulo | Observação |
|---|---|---|
| `medical_records` | Prontuários | Dado clínico sensível; criptografia adicional em avaliação |
| `record_access_log` | Auditoria LGPD | Quem acessou qual prontuário e quando (TODO M3) |
| `teleconsultations` | Teleconsulta | Metadados de sessão (não a mídia) |
| `invoices` / `payments` | Financeiro | Lógica fiscal na camada de serviço |
| `fiscal_notes` | NFS-e | Integração Asaas/Pagar.me |

---

## Pendências

- [ ] TODO M1: controle de visibilidade de `notes` clínico por papel (recepcao vs profissional) — LGPD art. 6, 11. Fase posterior.
- [ ] TODO M3: tabela `record_access_log` (auditoria de acesso a prontuário — exigência LGPD). Fase posterior, antes do go-live.
- [ ] Criptografia adicional de campos clínicos (cpf, notes de prontuário) na camada de aplicação.
- [ ] Política de retenção automatizada (job de purga com aprovação DPO).
- [ ] Estratégia de backup e PITR (Supabase — habilitar no dashboard).
- [ ] Index de texto completo em `patients.full_name` para busca (migration futura, avaliar `pg_trgm`).
