-- =============================================================================
-- Migration: 0003_clinic_id_defaults.sql
-- Harmoni Care — Defaults de clinic_id via auth_clinic_id()
-- Data: 2026-06-19
-- Reversível: ver seção DOWN no final do arquivo.
--
-- RACIONAL (segurança + ergonomia):
--
--   Antes desta migration, o cliente precisava enviar clinic_id explicitamente
--   no payload de INSERT (patients, appointments). Isso apresenta dois riscos:
--
--   1. Erro de programação: o agente de UI poderia esquecer de incluir o
--      clinic_id, causando falha de constraint NOT NULL. Embora a RLS já
--      bloqueie inserções em outros tenants (WITH CHECK = auth_clinic_id()),
--      o erro superficial seria confuso e difícil de diagnosticar.
--
--   2. Superfície de ataque desnecessária: ao forçar o cliente a enviar o
--      clinic_id, criamos um campo cujo valor o servidor DEVE ignorar (a RLS
--      prevalece), mas que pode ser tentado via adulteração de requisição.
--      Embora a política WITH CHECK bloqueie o ataque, é melhor design nunca
--      aceitar campos que o servidor não vai usar.
--
--   Com este DEFAULT:
--   - O cliente NUNCA precisa enviar clinic_id — o banco o preenche
--     automaticamente via auth_clinic_id(), que consulta profiles com base
--     em auth.uid() (não adulterável pelo cliente).
--   - A política WITH CHECK continua em vigor: mesmo que o cliente envie um
--     clinic_id diferente, a policy rejeita. O default é a primeira linha de
--     defesa; a RLS é a segunda.
--   - Código de aplicação fica mais limpo: o data layer não passa clinic_id
--     nos INSERTs, eliminando classe de bugs por omissão ou mismatch.
--
-- IDEMPOTÊNCIA:
--   ALTER TABLE … SET DEFAULT é seguro para re-execução: se o default já
--   existir com o mesmo valor, o Postgres simplesmente sobrescreve sem erro.
--   Não há risco de aplicar duas vezes.
--
-- IMPACTO DE SCHEMA:
--   - Sem downtime: ALTER TABLE … SET DEFAULT é uma operação de metadados
--     (não reescreve linhas existentes). Executa em milissegundos mesmo em
--     tabelas grandes.
--   - Linhas existentes não são afetadas (clinic_id já está preenchido).
--   - INSERTs futuros sem clinic_id recebem o valor de auth_clinic_id().
--   - INSERTs com clinic_id explícito ainda são aceitos se passarem no WITH
--     CHECK da policy (clinic_id = auth_clinic_id()); caso contrário, a RLS
--     rejeita normalmente.
--
-- LGPD:
--   Reduz superficie de passagem de dados de tenant pelo payload do cliente,
--   diminuindo risco de vazamento de identificadores de organização em logs
--   de proxy/CDN que capturam corpos de requisição.
-- =============================================================================

-- =============================================================================
-- UP
-- =============================================================================

-- ---------------------------------------------------------------------------
-- patients.clinic_id — default via auth_clinic_id()
-- ---------------------------------------------------------------------------
-- auth_clinic_id() é STABLE SECURITY DEFINER: resolve o tenant do usuário
-- autenticado via auth.uid() em public.profiles. Não pode ser forjada pelo
-- cliente (dependente do JWT assinado pelo Supabase, não de claims do payload).
--
-- Depende de: public.auth_clinic_id() (criada em 0001_init.sql, bloco 5).
alter table public.patients
  alter column clinic_id set default public.auth_clinic_id();

comment on column public.patients.clinic_id is
  'Chave de tenant (clinic_id). DEFAULT = public.auth_clinic_id(): preenchida'
  ' automaticamente pelo banco no INSERT via sessão autenticada. O cliente não'
  ' deve (nem precisa) enviar este campo. A RLS WITH CHECK garante isolamento'
  ' mesmo se enviado explicitamente. Derivada de public.profiles via auth.uid().';

-- ---------------------------------------------------------------------------
-- appointments.clinic_id — default via auth_clinic_id()
-- ---------------------------------------------------------------------------
-- Mesmo racional de patients acima. Appointments tem FKs compostas que
-- exigem que patient_id e professional_id pertençam ao mesmo clinic_id —
-- o default garante consistência sem que o cliente precise orquestrar isso.
alter table public.appointments
  alter column clinic_id set default public.auth_clinic_id();

comment on column public.appointments.clinic_id is
  'Chave de tenant (clinic_id). DEFAULT = public.auth_clinic_id(): preenchida'
  ' automaticamente no INSERT. FKs compostas (patient_id+clinic_id,'
  ' professional_id+clinic_id) garantem coerência de tenant no banco (A1).'
  ' O cliente não deve enviar este campo; o default e a RLS cuidam disso.';

-- =============================================================================
-- DOWN (reversão — executar no SQL Editor do Supabase se necessário)
-- =============================================================================
-- Para reverter esta migration, execute os comandos abaixo:
--
-- alter table public.appointments
--   alter column clinic_id drop default;
--
-- alter table public.patients
--   alter column clinic_id drop default;
--
-- comment on column public.appointments.clinic_id is
--   'Chave de tenant. Derivada pelo servidor; nunca aceite este valor do cliente.';
--
-- comment on column public.patients.clinic_id is
--   'Chave de tenant. Derivada pelo servidor; nunca aceite este valor do cliente.';
-- =============================================================================
