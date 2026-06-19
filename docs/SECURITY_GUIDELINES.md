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
