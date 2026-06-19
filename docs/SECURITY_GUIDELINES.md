# SECURITY_GUIDELINES — Harmoni Care

> App de saúde, multi-tenant, sob LGPD (dados sensíveis art. 11). Mantido com o agente `security-reviewer`.

## Princípios inegociáveis
1. **Isolamento de tenant** via RLS em toda tabela de domínio. Testar cross-tenant.
2. **Sem segredo no código/client bundle.** Apenas variáveis de ambiente; service keys só no servidor.
3. **Nunca logar dado sensível** (CPF, prontuário, contato do paciente).
4. **Validação no servidor** (Zod) em toda entrada.
5. **Auditoria** de acesso a prontuário (`record_access_log`).

## Autenticação / Autorização
- Supabase Auth; senhas fortes; MFA para admin (avaliar).
- Sessões com expiração e refresh seguro.
- Autorização por papel + tenant na camada de serviço E na RLS (defesa em profundidade).
- Prevenir escalonamento de privilégio e IDOR.

## LGPD
- Base legal documentada para cada categoria de dado.
- Direitos do titular: acesso, correção, exclusão (fluxo definido).
- Retenção e descarte por tabela.
- Residência de dados em região Brasil (Supabase São Paulo).
- Termo de consentimento e política de privacidade.

## Abuso / Hardening
- Rate limiting em login, reset de senha e endpoints de escrita.
- Proteção contra enumeração de usuários (mensagens genéricas).
- Headers de segurança (CSP, HSTS) e CORS restrito.
- Upload: validar tipo/tamanho, varrer, storage privado com URLs assinadas.
- Dependências: auditoria regular (`pnpm audit`), Dependabot.

## Checklist de release de segurança
- [ ] RLS testada cross-tenant em todas as tabelas tocadas.
- [ ] Nenhum segredo no diff/bundle.
- [ ] Nenhum dado sensível em log/erro.
- [ ] Rate limit nos endpoints sensíveis.
- [ ] `/security-review` rodado e críticos/altos resolvidos.

---

## Auditoria de RLS — migration 0001 (2026-06-19)

Auditoria adversarial do schema inicial e RLS. Conclusões registradas para acompanhamento.

### Sólido (validado)
- `auth_clinic_id()` deriva o tenant de `auth.uid()` -> `profiles`, ignorando claims de JWT: tenant hopping por JWT forjado bloqueado.
- Funções SECURITY DEFINER com `search_path = ''` e nomes qualificados: imunes a search_path poisoning.
- `auth_clinic_id()` NULL para usuário sem profile resulta em `clinic_id = NULL` => `UNKNOWN` => nega tudo (fail-closed).
- `with check` em todos INSERT/UPDATE impede gravar `clinic_id` de outro tenant.
- `profiles_insert_own` amarra `id = auth.uid()` e `clinic_id = auth_clinic_id()`.
- Unique de CPF por `(clinic_id, cpf)`: sem enumeracao cross-tenant.

### Pendencias de correcao (priorizado)

- [x] CRITICO C1: policy `profiles_update_same_clinic` permitia auto-promocao de `role` (recepcao -> admin).
  CORRIGIDO: removida policy antiga; criada `profiles_self_update` com WITH CHECK que verifica via subquery
  que role e clinic_id nao mudam; criada `is_clinic_admin()` (SECURITY DEFINER, STABLE); criada RPC
  `update_member_role()` (SECURITY DEFINER) como canal unico e auditavel para mudanca de papel — bloqueia
  auto-escalonamento e cruzamento de tenant no banco, independente da camada de servico.

- [x] CRITICO C2: `FORCE ROW LEVEL SECURITY` adicionado em todas as tabelas de dominio (clinics, profiles,
  patients, appointments). `REVOKE ALL ON <tabela> FROM anon` em todas. Grants minimos concedidos a
  `authenticated`: clinics (SELECT), profiles (SELECT/INSERT/UPDATE), patients (SELECT/INSERT/UPDATE),
  appointments (SELECT/INSERT/UPDATE/DELETE — DELETE filtrado por policy admin-only).

- [x] ALTO A1: coerencia de tenant em appointments garantida via FK composta no banco.
  Adicionados UNIQUE(id, clinic_id) em patients (uq_patients_id_clinic) e profiles (uq_profiles_id_clinic).
  appointments usa FK composta fk_appointments_patient_clinic e fk_appointments_professional_clinic,
  garantindo que patient e professional pertencem ao mesmo clinic_id do agendamento — violacao causa erro
  de FK no banco, nao apenas na camada de servico.

- [x] ALTO A2: trigger `appointments_check_professional` (BEFORE INSERT/UPDATE OF professional_id, SECURITY
  INVOKER) verifica que professional_id tem role 'profissional' ou 'admin' no mesmo tenant. role 'recepcao'
  e rejeitado com errcode check_violation. Regra de negocio documentada em comment on function.

- [ ] TODO M1: `notes` clinico legivel por `recepcao`; aplicar controle por papel (LGPD art. 6, 11).
  NAO corrigido nesta fase — registrado como TODO em DATABASE_SCHEMA.md e no comment da coluna.

- [x] MEDIO M2: `set_updated_at()` alterada de SECURITY DEFINER para SECURITY INVOKER. Trigger nao precisa
  de privilegio elevado; DEFINER expandia superficie de ataque desnecessariamente.

- [ ] TODO M3: implementar `record_access_log` (auditoria de acesso a dado de saude) antes do go-live.
  NAO corrigido nesta fase — registrado como TODO em DATABASE_SCHEMA.md.

- [x] MEDIO M4: guard real de ambiente no 0002_seed_dev.sql implementado via DO $$ BEGIN ... END $$;
  Verifica GUC `app.environment` = 'development'; se diferente ou ausente, RAISE EXCEPTION com errcode
  insufficient_privilege, abortando todo o bloco e impedindo qualquer insercao. Instrucoes de configuracao
  documentadas no arquivo.

- [x] BAIXO B1: hard delete de appointments restrito a admin via policy `appointments_delete_admin_only`
  usando `is_clinic_admin()` (SECURITY DEFINER). Usuarios nao-admin devem usar UPDATE status='cancelado'.

- [x] BAIXO B2: validacao de digito verificador de CPF implementada em
  packages/core/src/schemas/patient.ts via `.refine(isValidCpf, ...)`. Algoritmo da Receita Federal
  (dois digitos verificadores + rejeicao de sequencias triviais). Campo permanece opcional — compatibilidade
  mantida.

- [ ] BAIXO B3: garantir que handlers nao logam o objeto de input (cpf/email/notes) em erros 4xx.
  Acompanhar na revisao de handlers (fora do escopo de banco).

### Regra permanente
- RLS e a unica fronteira confiavel de tenant/papel: PostgREST/Supabase expoe tabelas diretamente ao cliente. Toda restricao de coluna sensivel (role, clinic_id) e de papel DEVE existir na policy do banco, nao apenas na camada de servico.
- FORCE ROW LEVEL SECURITY garante que mesmo roles privilegiadas nao-service_role nao bypassem RLS.
- Canal unico para escalonamento de papel: funcao RPC update_member_role() — nunca UPDATE direto em profiles.
