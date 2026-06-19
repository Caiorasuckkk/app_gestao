---
description: Implementa uma nova tela seguindo o fluxo padrão (dados → design → UI → testes → review)
---
Implemente a tela: $ARGUMENTS

Siga o fluxo padrão do Harmoni Care (ver AGENTS.md):
1. Defina o escopo e o critério de aceite (qual dado, quais papéis acessam).
2. Use o agente `backend-data` para garantir dados/API/RLS necessários (com isolamento de tenant).
3. Use o agente `design-system` se faltar componente/token.
4. Use o agente `frontend-web` (ou `mobile`) para implementar a tela conectada, com loading/erro/vazio.
5. Use o agente `qa-tester` para testes (inclua teste de isolamento de tenant).
6. Rode `/code-review` e, se for tela com dado sensível, o agente `security-reviewer`.
Indique todos os arquivos criados/alterados e confirme o critério de aceite.
