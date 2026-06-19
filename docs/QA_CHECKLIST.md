# QA_CHECKLIST — Harmoni Care

> Mantido com o agente `qa-tester`. Uma feature só é "pronta" quando passa nos itens aplicáveis.

## Por feature
- [ ] Caminho feliz funciona.
- [ ] Estados de loading, erro e vazio tratados na UI.
- [ ] Validação no servidor (Zod) além do cliente.
- [ ] Isolamento de tenant testado (usuário A não acessa dado de B).
- [ ] Autorização por papel testada (acesso negado quando deve).
- [ ] Sem dado sensível em log/console/resposta de erro.
- [ ] Testes unitários (regras) + integração (API/RLS) verdes.
- [ ] Sem regressão em fluxos existentes.

## Multi-tenant / Segurança
- [ ] RLS ativa em toda tabela tocada.
- [ ] IDOR verificado nos endpoints.
- [ ] Rate limit em login/escrita sensível.

## UI / UX
- [ ] Fiel ao Figma (tokens do design system).
- [ ] Acessível (contraste, foco, teclado, aria).
- [ ] Responsivo (web) / safe area e gestos (mobile).

## Performance
- [ ] Sem waterfalls evidentes; listas grandes virtualizadas.
- [ ] Core Web Vitals aceitáveis (web).

## Pré-produção
- [ ] `/code-review` sem bugs pendentes.
- [ ] `/security-review` sem críticos/altos.
- [ ] Observabilidade (Sentry) capturando erros.
- [ ] Smoke test em staging.
