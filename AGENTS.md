# AGENTS.md — Operação de agentes do Harmoni Care

O **thread principal** (você + Claude na conversa) atua como **Arquiteto + PM + Coordenador**.
Subagents não enxergam uns aos outros e não orquestram — quem coordena é o thread principal.
Regras transversais ficam no `CLAUDE.md` (lido por todos automaticamente).

## Os 7 subagents

| Agente | Use quando | Entrega | Não faz |
|---|---|---|---|
| `design-system` | extrair tokens, criar/ajustar componentes de UI | tokens em `packages/ui`, componentes, `DESIGN_SYSTEM.md` | backend, lógica, deploy |
| `frontend-web` | telas/rotas/forms no Next.js | páginas web tipadas, conectadas | modelagem de dados, estilos fora dos tokens |
| `mobile` | telas Expo/RN para equipe, builds EAS | telas mobile, config de build | regras de negócio, modelagem |
| `backend-data` | tabelas, migrations, RLS, API, integrações | migrations, políticas RLS, API + Zod, `DATABASE_SCHEMA.md` | UI, estilos, lojas |
| `security-reviewer` | antes de merge sensível e em marcos | relatório priorizado + LGPD, `SECURITY_GUIDELINES.md` | features grandes |
| `code-reviewer` | revisar diffs | achados arquivo:linha, separando bug de estilo | reescrever sem necessidade |
| `qa-tester` | escrever/rodar testes | unit/integ/e2e, cobre tenant e erro | alterar lógica de produção |

## Skills (não recriar como agente)
- `/security-review` — segurança do diff atual.
- `/code-review` (ou `/code-review ultra`) — revisão de código.
- `prompt-engineer` / `prompt-architect` — afiar prompts de agente.

## Como chamar
- Automático: descreva a tarefa; o agente certo é acionado pela `description`.
- Explícito: `use the <nome> agent to <tarefa>`.
- Exemplo: `use the backend-data agent to model pacientes with tenant isolation and RLS`.

## Fluxo padrão de uma feature
1. Thread principal define escopo e critério de aceite (ROADMAP).
2. `backend-data` modela dados + RLS + API.
3. `design-system` garante tokens/componentes.
4. `frontend-web` / `mobile` implementam a tela conectada.
5. `qa-tester` escreve testes (inclui isolamento de tenant).
6. `code-reviewer` revisa o diff; `security-reviewer` em features sensíveis.
7. Thread principal valida critério de aceite e marca como pronto.

## Regra de ouro de qualidade
Toda feature que toca dados de pacientes só é "pronta" com: RLS testada cross-tenant, estados de erro/vazio na UI, validação no servidor, e zero segredo/dado sensível em log.
