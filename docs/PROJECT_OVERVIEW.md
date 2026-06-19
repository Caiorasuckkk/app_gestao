# PROJECT_OVERVIEW — Harmoni Care

## O que é
SaaS B2B multi-tenant para gestão de clínicas de saúde multidisciplinares. Cada clínica é um tenant isolado.

## Personas
- **Admin da clínica** — configura a clínica, equipe, planos, vê relatórios.
- **Profissional de saúde** — agenda, atende, registra prontuário, teleconsulta.
- **Recepção/secretaria** — agenda, cadastro de pacientes, financeiro do dia.
- (Futuro) **Paciente** — fora do escopo atual; mobile é para a equipe.

## Módulos
Agenda · Pacientes · Prontuários · Teleconsulta · Financeiro · Notas Fiscais (NFS-e) · Equipes · Relatórios · Configurações.

## Surfaces
- **Web (primária)** — dashboard de gestão, denso em dados.
- **Mobile (equipe)** — Expo/RN: agenda, pacientes, prontuário em campo.

## Restrições que definem a engenharia
1. Dados de saúde = dados sensíveis (LGPD art. 11) → segurança e auditoria são pré-requisito.
2. Multi-tenant → isolamento por RLS em toda tabela.
3. Features reguladas/pesadas (teleconsulta, NFS-e, pagamentos) → integrar, não construir do zero.

## Escopo do MVP (ver ROADMAP)
Auth + papéis + multi-tenant, Pacientes, Agenda, Prontuários (web), mobile básico da equipe.

## Não-objetivos (por enquanto)
App do paciente, BI avançado, marketplace, integrações além das essenciais.
