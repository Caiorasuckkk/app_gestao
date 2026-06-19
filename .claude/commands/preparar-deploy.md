---
description: Roda o checklist de pré-deploy (segurança, QA, env, migrations)
---
Prepare o deploy para o ambiente: $ARGUMENTS (staging|production)

Execute o checklist (ver docs/DEPLOYMENT.md e docs/QA_CHECKLIST.md):
1. Rode `/code-review` e `/security-review`; resolva críticos/altos.
2. Confirme migrations testadas e reversíveis.
3. Verifique env vars do ambiente (nenhum secret faltando ou exposto no bundle).
4. Confirme observabilidade (Sentry) ativa.
5. Liste o que será deployado e os riscos.
Não faça o deploy efetivo sem confirmação explícita do usuário.
