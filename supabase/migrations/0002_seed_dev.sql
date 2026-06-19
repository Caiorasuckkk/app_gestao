-- =============================================================================
-- Migration: 0002_seed_dev.sql
-- Harmoni Care — Seed de desenvolvimento (DEV-ONLY)
-- Data: 2026-06-19
--
-- !! ESTE ARQUIVO NÃO DEVE SER APLICADO EM PRODUÇÃO OU STAGING !!
-- Contém dados fictícios sem qualquer relação com pessoas reais.
-- Aplicar apenas em ambiente local de desenvolvimento.
--
-- Como aplicar apenas em dev:
--   supabase db reset         # recria o banco do zero com todas as migrations
--   # 0002 é aplicado automaticamente em reset local.
--   # Em produção: supabase db push (não inclui seeds por padrão).
--
-- Reversão: limpar tabelas na ordem inversa de FK.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Guard M4: aborta se não estiver em ambiente de desenvolvimento
-- ---------------------------------------------------------------------------
-- DESIGN DECISION:
-- O comentário de "atenção" anterior não era uma proteção real — um DBA
-- distraído poderia simplesmente ignorá-lo e aplicar o seed em produção.
--
-- Solução: usamos um GUC (parâmetro de configuração do Postgres) como flag
-- de ambiente. O Supabase CLI define `app.environment = 'development'` no
-- arquivo supabase/config.toml (ou via `supabase start --env`). Em ambientes
-- de produção/staging esse GUC não é definido (ou é definido como 'production').
--
-- Se o GUC não estiver definido como 'development', a execução é abortada com
-- RAISE EXCEPTION, que faz rollback de todo o bloco e impede qualquer inserção.
--
-- Para configurar em dev local, adicione ao supabase/config.toml:
--   [db.settings]
--   app.environment = "development"
--
-- Ou passe via psql: SET app.environment = 'development';
-- ---------------------------------------------------------------------------
do $$
begin
  if current_setting('app.environment', true) is distinct from 'development' then
    raise exception
      'SEED ABORTADO: este arquivo só pode ser executado em ambiente development.'
      ' GUC app.environment = ''%'' (esperado: ''development'').'
      ' Configure supabase/config.toml: [db.settings] app.environment = "development"',
      coalesce(current_setting('app.environment', true), '<não definido>')
      using errcode = 'insufficient_privilege';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Clínica de exemplo
-- ---------------------------------------------------------------------------
insert into public.clinics (id, name, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'Clínica Demo Harmoni',
  now(),
  now()
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Notas sobre profiles e patients no seed
-- ---------------------------------------------------------------------------
-- profiles requerem um auth.users correspondente (FK para auth.users.id).
-- No ambiente Supabase local, crie o usuário via:
--
--   supabase auth admin create-user \
--     --email admin@demo.harmonicare.local \
--     --password "SenhaDev@123" \
--     --user-metadata '{"full_name":"Admin Demo"}'
--
-- E então insira o profile com o UUID retornado pelo comando acima.
-- Não inserimos auth.users diretamente aqui para respeitar a camada de Auth.
--
-- Para patients e appointments: criar via API local após autenticação,
-- para que a RLS valide corretamente o clinic_id via auth_clinic_id().
--
-- Exemplo de insert de profile (substitua <USER_UUID> pelo UUID real):
-- insert into public.profiles (id, clinic_id, role, full_name)
-- values (
--   '<USER_UUID>',
--   '00000000-0000-0000-0000-000000000001',
--   'admin',
--   'Admin Demo'
-- )
-- on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- DOWN (reversão do seed)
-- ---------------------------------------------------------------------------
-- delete from public.clinics where id = '00000000-0000-0000-0000-000000000001';
-- =============================================================================
