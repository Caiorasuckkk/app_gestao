-- =============================================================================
-- Migration: 0001_init.sql
-- Harmoni Care — Schema núcleo (Fase 1)
-- Data: 2026-06-19
-- Reversível: ver seção DOWN no final do arquivo.
--
-- LGPD (Lei 13.709/2018):
--   - Dados de pacientes são dados sensíveis (art. 11) — criptografia at-rest
--     garantida pelo Supabase (AES-256). Campos críticos (cpf, email, phone)
--     podem receber criptografia adicional na camada de aplicação em versão
--     futura (ver pendências em DATABASE_SCHEMA.md).
--   - Base legal: execução de contrato (art. 7º, V) para agendamentos;
--     tutela da saúde (art. 11, II, f) para dados clínicos.
--   - Retenção: dados de pacientes retidos pelo prazo mínimo exigido pelo
--     CFM (20 anos para prontuários); soft delete via deleted_at.
--   - Auditoria de acesso a prontuário será implementada em migration futura
--     (tabela record_access_log).
--   - NUNCA logar conteúdo das colunas sensíveis (cpf, email, phone,
--     full_name de patients) em logs de aplicação ou banco.
--
-- Segurança (auditoria 2026-06-19):
--   - FORCE ROW LEVEL SECURITY em todas as tabelas de domínio (C2).
--   - REVOKE ALL FROM anon + grants mínimos para authenticated (C2).
--   - is_clinic_admin() para gestão de papéis (C1).
--   - Políticas de UPDATE em profiles bloqueiam auto-promoção de role (C1).
--   - FK composta garante coerência de tenant em appointments (A1).
--   - Trigger verifica role do professional_id (A2).
--   - Hard delete em appointments restrito a admin (B1).
--   - TODO M1: controle de `notes` por papel — fase posterior.
--   - TODO M3: record_access_log — fase posterior.
--
-- ORDEM DE APLICAÇÃO (corrigida para evitar 42P01 no SQL Editor):
--   1. Extensions + enums
--   2. Função genérica sem dependência de tabela (set_updated_at)
--   3. Todas as tabelas com colunas, constraints, FKs, índices e unique indexes
--      (sem policies ainda; unique indexes compostos de patients e profiles
--       devem preceder a criação de appointments por causa das FKs compostas)
--   4. Funções que dependem de tabelas: auth_clinic_id, is_clinic_admin,
--      update_member_role, check_professional_role
--   5. ENABLE + FORCE RLS, REVOKEs, GRANTs
--   6. Policies (usam as funções do passo 4)
--   7. Triggers (set_updated_at e check_professional_role) e comments
-- =============================================================================

-- =============================================================================
-- BLOCO 1: Extensions
-- =============================================================================

-- pgcrypto: gen_random_uuid() em Postgres < 13; no PG14+ é nativo mas
-- habilitamos para compatibilidade e para funções de hash futuras.
create extension if not exists "pgcrypto";

-- uuid-ossp: UUID v4 alternativo; mantemos por consistência com Supabase.
create extension if not exists "uuid-ossp";

-- =============================================================================
-- BLOCO 2: Enums
-- =============================================================================

-- Papel do usuário dentro de uma clínica (tenant).
-- Enum no Postgres garante integridade sem tabela lookup.
do $$ begin
  create type public.user_role as enum (
    'admin',        -- gestor da clínica; acesso total ao tenant
    'profissional', -- profissional de saúde; acesso a prontuários
    'recepcao'      -- recepcionista; agenda e dados básicos de pacientes
  );
exception when duplicate_object then null; end $$;

-- Status possíveis de um agendamento.
do $$ begin
  create type public.appointment_status as enum (
    'agendado',   -- criado, aguardando confirmação
    'confirmado', -- confirmado pelo paciente ou pela clínica
    'cancelado',  -- cancelado por qualquer parte
    'realizado'   -- atendimento concluído
  );
exception when duplicate_object then null; end $$;

-- =============================================================================
-- BLOCO 3: Função genérica sem dependência de tabela
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Função auxiliar: trigger de updated_at
-- ---------------------------------------------------------------------------
-- Reutilizada em todas as tabelas que precisam de updated_at automático.
--
-- SECURITY INVOKER (M2-fix): triggers NÃO precisam de SECURITY DEFINER.
-- A função roda com os privilégios do usuário que disparou o DML, o que é
-- correto e mais seguro — não há razão para elevar privilégios aqui.
-- SECURITY DEFINER em trigger function expande superfície de ataque sem
-- necessidade.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- BLOCO 4: Tabelas (sem policies)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Tabela: clinics (tenant raiz)
-- ---------------------------------------------------------------------------
-- Não tem tenant_id — ela *é* o tenant. RLS habilitado mas sem política de
-- isolamento por clinic_id; acesso controlado por papel na camada de serviço.
-- Um usuário autenticado pode ler apenas a própria clínica (via profiles).

create table if not exists public.clinics (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null check (char_length(name) between 2 and 200),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.clinics is
  'Tenant raiz. Cada linha representa uma clínica/empresa cliente do SaaS.';

-- ---------------------------------------------------------------------------
-- Tabela: profiles
-- ---------------------------------------------------------------------------
-- Extensão de auth.users. id = auth.uid(). Um usuário pertence a UMA clínica.
-- ATENÇÃO: full_name é dado pessoal — não logar.

create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  clinic_id   uuid        not null references public.clinics(id) on delete restrict,
  role        public.user_role not null default 'recepcao',
  full_name   text        not null check (char_length(full_name) between 2 and 200),
  created_at  timestamptz not null default now()
  -- Sem updated_at propositalmente: alterações de perfil são infrequentes e
  -- serão auditadas via tabela de auditoria futura. Se necessário, adicionar
  -- em migration futura com ALTER TABLE.
);

comment on table public.profiles is
  'Perfil de usuário vinculado a auth.users. Define papel e tenant (clinic_id).'
  ' full_name é dado pessoal (LGPD) — não incluir em logs.';

comment on column public.profiles.clinic_id is
  'Chave de tenant. Derivada pelo servidor; nunca aceite este valor do cliente.';

comment on column public.profiles.role is
  'Papel no tenant. Alteração somente via update_member_role() por admin.'
  ' UPDATE direto de role é bloqueado pela policy profiles_self_update.';

-- Índices em profiles
-- Justificativa: clinic_id é filtrado em toda query de listagem de membros
-- e é o valor retornado por auth_clinic_id() (lookup por id=auth.uid()).
create index if not exists idx_profiles_clinic_id
  on public.profiles(clinic_id);

-- ---------------------------------------------------------------------------
-- UNIQUE composto (id, clinic_id) em profiles    [A1]
-- ---------------------------------------------------------------------------
-- Necessário para que appointments possa usar FK composta
-- (professional_id, clinic_id) referenciando profiles(id, clinic_id).
-- Garante, no nível do banco, que um agendamento só pode referenciar um
-- profissional que pertença ao mesmo tenant do agendamento.
-- DEVE preceder a criação da tabela appointments.
create unique index if not exists uq_profiles_id_clinic
  on public.profiles(id, clinic_id);

-- ---------------------------------------------------------------------------
-- Tabela: patients
-- ---------------------------------------------------------------------------
-- Dados sensíveis LGPD art. 11. Soft delete via deleted_at.
-- CPF: dado sensível identificador; armazenado sem índice único exposto
-- para evitar fingerprinting por timing attack em índices B-tree.
-- Se necessário busca por CPF, use índice parcial em scope de clinic_id
-- e apenas em layer de serviço autenticada.

create table if not exists public.patients (
  id          uuid        primary key default gen_random_uuid(),
  clinic_id   uuid        not null references public.clinics(id) on delete restrict,
  full_name   text        not null check (char_length(full_name) between 2 and 200),
  -- birth_date: date puro; sem timezone (não há hora).
  birth_date  date,
  -- cpf: DADO SENSÍVEL. Armazenado em texto para preservar zeros à esquerda.
  -- NÃO criar índice único isolado em cpf — apenas composto com clinic_id.
  -- NÃO logar este valor em nenhuma camada da aplicação.
  cpf         text        check (cpf ~ '^\d{11}$'),
  -- email e phone: dados pessoais — não logar.
  email       text        check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone       text        check (char_length(phone) between 8 and 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- Soft delete: preserva histórico de agendamentos e prontuários (LGPD retenção).
  deleted_at  timestamptz
);

comment on table public.patients is
  'Dados de pacientes. DADO SENSÍVEL (LGPD art. 11).'
  ' Soft delete via deleted_at. Nunca logar cpf, email, phone, full_name.';

comment on column public.patients.cpf is
  'CPF do paciente — dado sensível. Sem índice isolado para evitar timing attack.'
  ' Busca por CPF deve ocorrer apenas em camada de serviço autenticada,'
  ' usando índice composto (clinic_id, cpf).';

comment on column public.patients.deleted_at is
  'Soft delete. Retenção mínima: 20 anos (CFM). Exclusão definitiva via processo'
  ' controlado de purga com aprovação de DPO.';

-- Índices em patients
-- Justificativa: clinic_id filtra todos os selects de pacientes por tenant.
create index if not exists idx_patients_clinic_id
  on public.patients(clinic_id);

-- Índice composto (clinic_id, deleted_at) para queries de listagem que
-- excluem registros deletados (cláusula where deleted_at is null mais comum).
create index if not exists idx_patients_clinic_active
  on public.patients(clinic_id, deleted_at)
  where deleted_at is null;

-- Índice composto (clinic_id, cpf): permite busca de paciente por CPF dentro
-- do escopo de um tenant sem expor CPFs de outros tenants.
-- NÃO criar unique constraint apenas em cpf — deve ser unique por clinic_id.
create unique index if not exists idx_patients_clinic_cpf
  on public.patients(clinic_id, cpf)
  where cpf is not null;

-- ---------------------------------------------------------------------------
-- UNIQUE composto (id, clinic_id) em patients    [A1]
-- ---------------------------------------------------------------------------
-- Necessário para que appointments use FK composta (patient_id, clinic_id)
-- referenciando patients(id, clinic_id). Garante no banco que um agendamento
-- só pode referenciar um paciente do mesmo tenant.
-- DEVE preceder a criação da tabela appointments.
create unique index if not exists uq_patients_id_clinic
  on public.patients(id, clinic_id);

-- ---------------------------------------------------------------------------
-- Tabela: appointments
-- ---------------------------------------------------------------------------
-- Agendamentos. Relaciona paciente e profissional dentro do tenant.
-- FKs compostas garantem coerência de tenant (A1): patient_id e
-- professional_id DEVEM pertencer ao mesmo clinic_id do agendamento.
-- Depende de: uq_patients_id_clinic e uq_profiles_id_clinic (criados acima).

create table if not exists public.appointments (
  id              uuid                    primary key default gen_random_uuid(),
  clinic_id       uuid                    not null references public.clinics(id) on delete restrict,
  -- patient_id: FK simples para integridade referencial básica.
  patient_id      uuid                    not null,
  -- professional_id: FK simples para integridade referencial básica.
  professional_id uuid                    not null,
  starts_at       timestamptz             not null,
  ends_at         timestamptz             not null,
  status          public.appointment_status not null default 'agendado',
  -- notes: observações do agendamento. Pode conter dado clínico sensível —
  -- tratar como dado sensível na aplicação (não logar).
  -- TODO M1: controle de leitura de `notes` por papel (recepcao vs profissional)
  -- — implementar em fase posterior conforme LGPD art. 6, 11.
  notes           text,
  created_at      timestamptz             not null default now(),

  -- Garante que o horário de fim é posterior ao de início.
  constraint appointments_time_order check (ends_at > starts_at),

  -- ---------------------------------------------------------------------------
  -- FK composta: patient_id + clinic_id    [A1]
  -- ---------------------------------------------------------------------------
  -- Garante NO BANCO que o paciente referenciado pertence ao mesmo tenant
  -- (clinic_id) do agendamento. Sem esta constraint, seria possível (por bug
  -- ou ataque) criar um agendamento em clinic_A referenciando um paciente de
  -- clinic_B, violando o isolamento multi-tenant.
  -- Depende de: UNIQUE(id, clinic_id) em patients (uq_patients_id_clinic).
  constraint fk_appointments_patient_clinic
    foreign key (patient_id, clinic_id)
    references public.patients(id, clinic_id)
    on delete restrict,

  -- ---------------------------------------------------------------------------
  -- FK composta: professional_id + clinic_id    [A1]
  -- ---------------------------------------------------------------------------
  -- Garante NO BANCO que o profissional referenciado pertence ao mesmo tenant
  -- do agendamento. Mesmo raciocínio que a FK de patient acima.
  -- Depende de: UNIQUE(id, clinic_id) em profiles (uq_profiles_id_clinic).
  constraint fk_appointments_professional_clinic
    foreign key (professional_id, clinic_id)
    references public.profiles(id, clinic_id)
    on delete restrict
);

comment on table public.appointments is
  'Agendamentos de consulta. notes pode conter dado clínico — não logar.'
  ' FK compostas garantem que patient e professional pertencem ao mesmo tenant.';

comment on column public.appointments.professional_id is
  'FK para profiles. Apenas usuários com role profissional ou admin podem ser'
  ' vinculados (validação via trigger check_professional_role — A2).';

comment on column public.appointments.notes is
  'Dado potencialmente clínico (LGPD). Não logar.'
  ' TODO M1: controle de visibilidade por papel (fase posterior).';

-- Índices em appointments
-- Justificativa: clinic_id filtra por tenant em toda query.
create index if not exists idx_appointments_clinic_id
  on public.appointments(clinic_id);

-- FK patient_id: joins e listagem de agenda por paciente.
create index if not exists idx_appointments_patient_id
  on public.appointments(patient_id);

-- FK professional_id: listagem de agenda por profissional.
create index if not exists idx_appointments_professional_id
  on public.appointments(professional_id);

-- starts_at: queries de agenda por período (range de datas). Índice composto
-- com clinic_id para cobrir o padrão de query mais comum:
-- WHERE clinic_id = $1 AND starts_at BETWEEN $2 AND $3
create index if not exists idx_appointments_clinic_starts_at
  on public.appointments(clinic_id, starts_at);

-- Status: filtro de listagem (ex.: agendamentos 'agendado' do dia).
create index if not exists idx_appointments_clinic_status
  on public.appointments(clinic_id, status);

-- =============================================================================
-- BLOCO 5: Funções que dependem de tabelas
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Função de segurança: auth_clinic_id()
-- ---------------------------------------------------------------------------
-- DESIGN DECISION (segurança crítica):
--
-- Problema: se derivarmos o tenant_id de um claim do JWT (ex.: jwt() ->> 'clinic_id'),
-- um cliente malicioso pode forjar/substituir esse claim, quebrando o isolamento
-- entre tenants. Isso é o vetor de ataque de "tenant hopping".
--
-- Solução: a função abaixo é SECURITY DEFINER (roda como o owner do schema,
-- não como o usuário chamador) e faz um SELECT na tabela `profiles` usando
-- auth.uid() — que é derivado pelo Supabase diretamente do JWT assinado com
-- o segredo do projeto, portanto não é forjável pelo cliente.
--
-- Toda política RLS usa auth_clinic_id() para derivar o tenant do contexto de
-- sessão atual, garantindo que mesmo que o payload JWT seja adulterado, o
-- isolamento permanece íntegro no banco.
--
-- Marcada como STABLE: pode ser avaliada uma vez por statement (não por row),
-- o que melhora performance sem comprometer segurança (auth.uid() é fixo
-- dentro de uma transação).
-- Depende de: public.profiles (criada no bloco 4).

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

comment on function public.auth_clinic_id() is
  'Retorna o clinic_id (tenant) do usuário autenticado consultando profiles.'
  ' SECURITY DEFINER: não pode ser influenciada por claims forjados no JWT.'
  ' Use esta função em toda política RLS — nunca jwt() ->> ''clinic_id''.';

-- ---------------------------------------------------------------------------
-- Função de segurança: is_clinic_admin()    [C1]
-- ---------------------------------------------------------------------------
-- DESIGN DECISION (anti-escalonamento de privilégio):
--
-- Problema: a policy de UPDATE em profiles, sem restrição de coluna, permite
-- que qualquer usuário autenticado altere a própria coluna `role` de 'recepcao'
-- para 'admin' (ou altere `clinic_id` para cruzar tenants). PostgREST expõe
-- a tabela diretamente — restringir apenas na camada de serviço não é suficiente.
--
-- Solução: is_clinic_admin() é SECURITY DEFINER e consulta profiles via
-- auth.uid(), sem confiar em qualquer parâmetro do chamador. Usada em:
--   (a) WITH CHECK de UPDATE de role — somente admin pode mudar role de outros.
--   (b) Função RPC update_member_role() — canal único e auditável de mudança de papel.
--   (c) Policy de DELETE em appointments — hard delete só por admin.
--
-- STABLE: avaliada uma vez por statement; auth.uid() fixo na transação.
-- Depende de: public.profiles (criada no bloco 4).

create or replace function public.is_clinic_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

comment on function public.is_clinic_admin() is
  'Retorna true se o usuário autenticado tem role=admin no seu tenant.'
  ' SECURITY DEFINER + STABLE. Usada em policies de gestão de papéis e'
  ' em restrições de DELETE privilegiado.';

-- ---------------------------------------------------------------------------
-- Função RPC privilegiada: update_member_role()    [C1]
-- ---------------------------------------------------------------------------
-- DESIGN DECISION (canal único para mudança de papel):
--
-- Em vez de depender exclusivamente de uma policy WITH CHECK complexa,
-- bloqueamos UPDATE de role diretamente no banco (a policy self-update
-- verifica que role e clinic_id não mudam) e expomos esta função SECURITY
-- DEFINER como o único canal autorizado para alterar papéis.
--
-- Vantagens:
--   1. Auditável: toda mudança de papel passa por aqui.
--   2. Anti-escalonamento: a checagem de admin é feita dentro da função,
--      com SECURITY DEFINER, não dependendo da RLS do chamador.
--   3. Sem risco de bypass via PostgREST UPDATE direto (a policy bloqueia).
--
-- Restrições:
--   - Somente o admin do mesmo tenant pode chamar com efeito.
--   - Não permite remover o próprio papel de admin (prevenção de lock-out).
--   - target_id deve pertencer ao mesmo tenant do caller.
-- Depende de: public.profiles (criada no bloco 4) e public.is_clinic_admin()
--   (criada acima neste bloco).

create or replace function public.update_member_role(
  target_id  uuid,
  new_role   public.user_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_caller_clinic_id uuid;
  v_target_clinic_id uuid;
begin
  -- Obtém o clinic_id do chamador via profiles (não via JWT).
  select clinic_id
    into v_caller_clinic_id
    from public.profiles
   where id = auth.uid();

  -- Obtém o clinic_id do alvo.
  select clinic_id
    into v_target_clinic_id
    from public.profiles
   where id = target_id;

  -- Somente admin pode executar.
  if not public.is_clinic_admin() then
    raise exception 'Acesso negado: apenas administradores podem alterar papéis.'
      using errcode = 'insufficient_privilege';
  end if;

  -- Admin não pode rebaixar a si mesmo (evita lock-out acidental).
  if target_id = auth.uid() then
    raise exception 'Administrador não pode alterar o próprio papel.'
      using errcode = 'check_violation';
  end if;

  -- Garante que o alvo pertence ao mesmo tenant do chamador.
  if v_target_clinic_id is null or v_target_clinic_id <> v_caller_clinic_id then
    raise exception 'Usuário alvo não encontrado no mesmo tenant.'
      using errcode = 'no_data_found';
  end if;

  update public.profiles
     set role = new_role
   where id = target_id
     and clinic_id = v_caller_clinic_id;
end;
$$;

comment on function public.update_member_role(uuid, public.user_role) is
  'Canal único e auditável para mudança de papel de membro.'
  ' Somente admin do mesmo tenant; não permite auto-rebaixamento.'
  ' SECURITY DEFINER: checagem de privilégio não pode ser bypassada.';

-- ---------------------------------------------------------------------------
-- Função trigger: check_professional_role()    [A2]
-- ---------------------------------------------------------------------------
-- DESIGN DECISION:
-- A coluna professional_id deveria referenciar apenas usuários com role
-- 'profissional' (ou 'admin', que pode também realizar atendimentos).
-- Implementar via CHECK constraint pura não é possível (constraint não pode
-- fazer SELECT em outra tabela no Postgres). Por isso usamos um trigger
-- BEFORE INSERT/UPDATE que aborta a operação se a role não for válida.
--
-- Regra de negócio: role 'recepcao' não pode ser professional_id de um
-- agendamento. Apenas 'profissional' e 'admin' são aceitos.
--
-- O trigger usa SECURITY INVOKER (sem DEFINER): ele valida dados de negócio,
-- não precisa de privilégio elevado. O acesso à tabela profiles durante o
-- trigger ocorre sob a role do usuário que disparou o DML; como profiles tem
-- RLS com select aberto ao mesmo tenant, a consulta é válida para usuários
-- autenticados. A service role (sem RLS) também consegue executar o trigger.
-- Depende de: public.profiles (criada no bloco 4).
-- O trigger que chama esta função é criado no bloco 7.

create or replace function public.check_professional_role()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role public.user_role;
begin
  select role
    into v_role
    from public.profiles
   where id = new.professional_id
     and clinic_id = new.clinic_id;

  if v_role is null then
    raise exception
      'professional_id % não encontrado no tenant %.',
      new.professional_id, new.clinic_id
      using errcode = 'foreign_key_violation';
  end if;

  if v_role not in ('profissional', 'admin') then
    raise exception
      'professional_id % tem role %, mas apenas ''profissional'' e ''admin'' podem ser vinculados a agendamentos.',
      new.professional_id, v_role
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

comment on function public.check_professional_role() is
  'Trigger BEFORE INSERT/UPDATE em appointments.'
  ' Garante que professional_id tenha role profissional ou admin (A2).'
  ' Regra de negócio: recepcao não pode ser profissional de um agendamento.';

-- =============================================================================
-- BLOCO 6: ENABLE + FORCE RLS, REVOKEs, GRANTs
-- =============================================================================

-- ---------------------------------------------------------------------------
-- RLS + Hardening: clinics    [C2]
-- ---------------------------------------------------------------------------
-- FORCE ROW LEVEL SECURITY: garante que mesmo o table owner (que por default
-- ignora RLS) seja barrado. Protege contra execuções acidentais via role
-- privilegiada que não seja service_role explícito do Supabase.
--
-- REVOKE ALL FROM anon: PostgREST/Supabase expõe as tabelas pela role `anon`
-- para usuários não autenticados. Dados de saúde não devem ser acessíveis
-- sem autenticação sob hipótese alguma.
--
-- GRANT mínimo para authenticated: clinics é somente leitura para o cliente
-- (INSERT/UPDATE/DELETE são feitos pela service role no onboarding/backend).

alter table public.clinics enable row level security;
alter table public.clinics force row level security;

revoke all on public.clinics from anon;
revoke all on public.clinics from authenticated;
-- Leitura apenas; escrita exclusiva pela service role (onboarding).
grant select on public.clinics to authenticated;

-- ---------------------------------------------------------------------------
-- RLS + Hardening: profiles    [C2]
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
-- SELECT: ver colegas do tenant.
-- INSERT: onboarding (o próprio usuário cria o seu profile).
-- UPDATE: o usuário atualiza o próprio full_name; admin muda role via RPC.
-- DELETE bloqueado (desativação via service role).
grant select, insert, update on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- RLS + Hardening: patients    [C2]
-- ---------------------------------------------------------------------------
alter table public.patients enable row level security;
alter table public.patients force row level security;

revoke all on public.patients from anon;
revoke all on public.patients from authenticated;
-- Leitura, criação e atualização (soft delete via update de deleted_at).
-- Hard delete é bloqueado pela policy patients_no_hard_delete.
grant select, insert, update on public.patients to authenticated;

-- ---------------------------------------------------------------------------
-- RLS + Hardening: appointments    [C2]
-- ---------------------------------------------------------------------------
alter table public.appointments enable row level security;
alter table public.appointments force row level security;

revoke all on public.appointments from anon;
revoke all on public.appointments from authenticated;
-- SELECT, INSERT, UPDATE: todos os papéis autenticados do tenant.
-- DELETE: restrito por policy (somente admin — ver B1 abaixo).
-- Concedemos DELETE no nível de grant mas a policy bloqueia para não-admin.
grant select, insert, update, delete on public.appointments to authenticated;

-- =============================================================================
-- BLOCO 7: Policies
-- =============================================================================
-- Todas as funções chamadas aqui (auth_clinic_id, is_clinic_admin) foram
-- criadas no bloco 5 e já referenciam public.profiles existente.

-- ---------------------------------------------------------------------------
-- Policies: clinics
-- ---------------------------------------------------------------------------

-- SELECT: só vê a clínica à qual pertence.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "clinics_select_own"
  on public.clinics
  for select
  to authenticated
  using (id = public.auth_clinic_id());

-- INSERT/UPDATE/DELETE: apenas via service role (onboarding backend).
-- Nenhuma policy para usuário normal (default deny).

-- ---------------------------------------------------------------------------
-- Policies: profiles
-- ---------------------------------------------------------------------------

-- SELECT: vê apenas perfis da mesma clínica.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "profiles_select_same_clinic"
  on public.profiles
  for select
  to authenticated
  using (clinic_id = public.auth_clinic_id());

-- INSERT: o próprio usuário cria seu perfil no onboarding (via trigger/edge fn).
-- clinic_id deve ser igual ao da função — impede criar perfil em outro tenant.
-- role recebe o default 'recepcao'; nunca aceitar role do payload do cliente
-- (a edge function de onboarding não envia role — usa o default do banco).
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (
    id = auth.uid()
    and clinic_id = public.auth_clinic_id()
  );

-- ---------------------------------------------------------------------------
-- UPDATE em profiles — anti-escalonamento de privilégio    [C1]
-- ---------------------------------------------------------------------------
-- DESIGN DECISION:
--
-- O usuário comum (recepcao/profissional) pode atualizar APENAS full_name.
-- As colunas `role` e `clinic_id` NÃO podem ser alteradas via UPDATE direto.
--
-- Implementação em duas políticas separadas:
--
-- (a) profiles_self_update: o próprio usuário pode atualizar somente full_name.
--     A cláusula WITH CHECK verifica que role e clinic_id permanecem iguais
--     aos valores atuais, bloqueando qualquer tentativa de auto-promoção.
--     Postgres avalia WITH CHECK CONTRA A NOVA LINHA — se role ou clinic_id
--     mudar em relação ao valor existente (OLD), a linha não passa.
--     Note: usamos uma subquery para obter os valores OLD (não disponíveis em
--     WITH CHECK de UPDATE em RLS), lendo o registro corrente da tabela.
--
-- (b) Mudança de role: BLOQUEADA via UPDATE direto. Canal único é a função
--     RPC update_member_role() (SECURITY DEFINER), que impede auto-promoção
--     e garante que só admin do mesmo tenant altere papéis.
--
-- Por que não uma policy "admin pode tudo"?
--   Uma policy permissiva para admin ainda permitiria que o admin alterasse
--   o próprio role para um papel diferente de admin (downgrade acidental ou
--   intencional por invasor que comprometeu a conta). A RPC bloqueia isso.
--
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.

create policy "profiles_self_update"
  on public.profiles
  for update
  to authenticated
  using (
    -- Somente o próprio usuário pode acionar esta policy.
    id = auth.uid()
    and clinic_id = public.auth_clinic_id()
  )
  with check (
    -- Garante que o usuário não mudou role nem clinic_id.
    -- Lemos os valores "antes" da atualização diretamente da tabela (SECURITY
    -- DEFINER de auth_clinic_id já isola o tenant; aqui comparamos com o
    -- registro existente usando uma subquery correlacionada).
    id = auth.uid()
    and clinic_id = (select p.clinic_id from public.profiles p where p.id = auth.uid())
    and role     = (select p.role      from public.profiles p where p.id = auth.uid())
  );

-- DELETE: apenas via service role (desativação de conta).
-- Sem policy de delete para usuário normal.

-- ---------------------------------------------------------------------------
-- Policies: patients
-- ---------------------------------------------------------------------------

-- SELECT: usuário vê apenas pacientes da sua clínica (inclui soft-deleted;
-- a aplicação filtra deleted_at is null, mas RLS garante isolamento de tenant).
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "patients_select_same_clinic"
  on public.patients
  for select
  to authenticated
  using (clinic_id = public.auth_clinic_id());

-- INSERT: deve inserir no próprio tenant.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "patients_insert_same_clinic"
  on public.patients
  for insert
  to authenticated
  with check (clinic_id = public.auth_clinic_id());

-- UPDATE: só dentro do próprio tenant.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "patients_update_same_clinic"
  on public.patients
  for update
  to authenticated
  using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

-- DELETE (hard): não permitido por RLS — soft delete via UPDATE deleted_at.
-- Purga física controlada pelo service role (processo DPO).
create policy "patients_no_hard_delete"
  on public.patients
  for delete
  using (false);

-- ---------------------------------------------------------------------------
-- Policies: appointments
-- ---------------------------------------------------------------------------

-- SELECT: apenas agendamentos do próprio tenant.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "appointments_select_same_clinic"
  on public.appointments
  for select
  to authenticated
  using (clinic_id = public.auth_clinic_id());

-- INSERT: deve pertencer ao próprio tenant.
-- Coerência de patient_id/professional_id garantida pelas FKs compostas (A1)
-- e pelo trigger check_professional_role (A2).
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "appointments_insert_same_clinic"
  on public.appointments
  for insert
  to authenticated
  with check (clinic_id = public.auth_clinic_id());

-- UPDATE: apenas dentro do próprio tenant.
-- Depende de: auth_clinic_id() (bloco 5) → profiles (bloco 4). OK.
create policy "appointments_update_same_clinic"
  on public.appointments
  for update
  to authenticated
  using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

-- ---------------------------------------------------------------------------
-- DELETE em appointments — restrito a admin    [B1]
-- ---------------------------------------------------------------------------
-- DESIGN DECISION:
-- Hard delete de agendamentos expõe risco de perda de histórico clínico e
-- financeiro. Restringimos ao papel admin via is_clinic_admin(). Usuários
-- não-admin devem usar UPDATE status='cancelado' (soft cancel).
-- is_clinic_admin() é SECURITY DEFINER — não pode ser bypassada.
-- Depende de: auth_clinic_id() e is_clinic_admin() (bloco 5) → profiles (bloco 4). OK.
create policy "appointments_delete_admin_only"
  on public.appointments
  for delete
  to authenticated
  using (
    clinic_id = public.auth_clinic_id()
    and public.is_clinic_admin()
  );

-- =============================================================================
-- BLOCO 8: Triggers
-- =============================================================================
-- Todos os triggers são criados após as tabelas (bloco 4) e as funções
-- que eles chamam (blocos 3 e 5).

-- Trigger de updated_at em clinics
-- Depende de: set_updated_at() (bloco 3) e tabela clinics (bloco 4). OK.
create or replace trigger clinics_set_updated_at
  before update on public.clinics
  for each row execute function public.set_updated_at();

-- Trigger de updated_at em patients
-- Depende de: set_updated_at() (bloco 3) e tabela patients (bloco 4). OK.
create or replace trigger patients_set_updated_at
  before update on public.patients
  for each row execute function public.set_updated_at();

-- Trigger A2: verificar role do professional_id em appointments
-- Depende de: check_professional_role() (bloco 5) e tabela appointments (bloco 4). OK.
create or replace trigger appointments_check_professional
  before insert or update of professional_id on public.appointments
  for each row execute function public.check_professional_role();

-- =============================================================================
-- DOWN (reversão — executar em ordem inversa)
-- =============================================================================
-- Para reverter esta migration:
--
-- drop trigger  if exists appointments_check_professional      on public.appointments;
-- drop trigger  if exists patients_set_updated_at              on public.patients;
-- drop trigger  if exists clinics_set_updated_at               on public.clinics;
--
-- drop policy if exists "appointments_delete_admin_only"      on public.appointments;
-- drop policy if exists "appointments_update_same_clinic"     on public.appointments;
-- drop policy if exists "appointments_insert_same_clinic"     on public.appointments;
-- drop policy if exists "appointments_select_same_clinic"     on public.appointments;
-- revoke select, insert, update, delete on public.appointments from authenticated;
-- drop table    if exists public.appointments;
--
-- drop policy if exists "patients_no_hard_delete"             on public.patients;
-- drop policy if exists "patients_update_same_clinic"         on public.patients;
-- drop policy if exists "patients_insert_same_clinic"         on public.patients;
-- drop policy if exists "patients_select_same_clinic"         on public.patients;
-- revoke select, insert, update on public.patients from authenticated;
-- drop index  if exists uq_patients_id_clinic;
-- drop table  if exists public.patients;
--
-- drop policy if exists "profiles_self_update"                on public.profiles;
-- drop policy if exists "profiles_insert_own"                 on public.profiles;
-- drop policy if exists "profiles_select_same_clinic"         on public.profiles;
-- revoke select, insert, update on public.profiles from authenticated;
-- drop index  if exists uq_profiles_id_clinic;
-- drop table  if exists public.profiles;
--
-- drop policy if exists "clinics_select_own"                  on public.clinics;
-- revoke select on public.clinics from authenticated;
-- drop table  if exists public.clinics;
--
-- drop function if exists public.check_professional_role();
-- drop function if exists public.update_member_role(uuid, public.user_role);
-- drop function if exists public.is_clinic_admin();
-- drop function if exists public.auth_clinic_id();
-- drop function if exists public.set_updated_at();
-- drop type   if exists public.appointment_status;
-- drop type   if exists public.user_role;
-- =============================================================================
