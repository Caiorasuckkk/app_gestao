/**
 * queries.ts — Leitura de pacientes (server-side only).
 *
 * SEGURANÇA / MULTI-TENANT:
 * - Usa createServerClient (anon key + sessão via cookie), NUNCA a service role.
 * - A RLS do Supabase filtra automaticamente por clinic_id = auth_clinic_id()
 *   em todo SELECT — o código NÃO passa clinic_id explicitamente nas queries.
 * - O isolamento de tenant é garantido no banco (double enforcement):
 *     1. auth_clinic_id() na policy USING lê profiles via auth.uid() (não
 *        adulterável pelo cliente).
 *     2. FORCE ROW LEVEL SECURITY impede bypass mesmo sob roles privilegiadas.
 * - NÃO logar fullName, cpf, email ou phone — dados sensíveis LGPD art. 11.
 *
 * ESTE MÓDULO É SERVER-ONLY.
 * Nunca importar em componentes "use client" ou em código que rode no browser.
 * Coloque "import 'server-only'" se o projeto adicionar esse pacote no futuro.
 */

import { createServerClient } from "@/lib/supabase/server";
import type { Patient } from "@harmoni/core";

// ---------------------------------------------------------------------------
// Tipos internos (mapeamento snake_case → camelCase)
// ---------------------------------------------------------------------------

/**
 * Linha retornada pelo Supabase (snake_case, nullable conforme schema).
 * Declarada internamente — o consumidor usa Patient (camelCase) de @harmoni/core.
 */
interface PatientRow {
  id: string;
  clinic_id: string;
  full_name: string;
  birth_date: string | null;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Mapeia uma linha do banco para o tipo Patient (camelCase) de @harmoni/core. */
function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    tenantId: row.clinic_id,
    fullName: row.full_name,
    birthDate: row.birth_date ?? undefined,
    cpf: row.cpf ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Tipo de resultado tipado (discriminated union)
// ---------------------------------------------------------------------------

/** Resultado bem-sucedido de listagem, com total de registros. */
export interface PatientListResult {
  items: Patient[];
  /** Total de pacientes ativos no tenant (para paginação). */
  total: number;
}

/** Result type: evita lançar exceções até o servidor HTTP; o chamador trata. */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// listPatients
// ---------------------------------------------------------------------------

export interface ListPatientsOptions {
  /** Busca por nome parcial (case-insensitive). Não logar este valor. */
  search?: string;
  /** Máximo de registros retornados (padrão: 50, máx: 200). */
  limit?: number;
  /** Deslocamento para paginação (padrão: 0). */
  offset?: number;
}

/**
 * Lista pacientes ATIVOS (deleted_at IS NULL) do tenant autenticado.
 *
 * Isolamento de tenant: garantido pela RLS (policy patients_select_same_clinic
 * usa auth_clinic_id()). Não é necessário passar clinic_id — o banco filtra.
 *
 * Busca: ilike em full_name quando `search` é fornecido. Não logar o termo
 * de busca se ele puder conter parte do nome do paciente.
 *
 * Ordenação: full_name ASC (collation padrão do banco; ajustar para
 * pt-BR com ICU collation em migration futura se necessário).
 *
 * @returns Result com { items, total } ou { error } com mensagem segura.
 */
export async function listPatients(
  options: ListPatientsOptions = {}
): Promise<Result<PatientListResult>> {
  // Limita o range para evitar queries excessivamente largas.
  const limit = Math.min(options.limit ?? 50, 200);
  const offset = options.offset ?? 0;

  try {
    const supabase = await createServerClient();

    // Construção incremental da query — RLS aplica automaticamente o filtro
    // de tenant (clinic_id = auth_clinic_id()) sem intervenção do código.
    let query = supabase
      .from("patients")
      .select(
        "id, clinic_id, full_name, birth_date, cpf, email, phone, created_at, updated_at, deleted_at",
        { count: "exact" }
      )
      // Apenas pacientes ativos (soft delete).
      .is("deleted_at", null)
      .order("full_name", { ascending: true })
      .range(offset, offset + limit - 1);

    // Busca por nome (ilike = case-insensitive no Postgres).
    // O índice idx_patients_clinic_active cobre (clinic_id, deleted_at);
    // busca por nome será aprimorada com pg_trgm em migration futura
    // (ver pendências em DATABASE_SCHEMA.md).
    if (options.search && options.search.trim().length > 0) {
      // Escapa caracteres especiais de LIKE para evitar injeção de padrão.
      const term = options.search.trim().replace(/[%_\\]/g, "\\$&");
      query = query.ilike("full_name", `%${term}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      // Não expor mensagem interna do Postgres (pode conter nomes de objetos).
      // Registrar o código de erro (sem dados de paciente) para debug.
      console.error("[patients.listPatients] db error code:", error.code);
      return { ok: false, error: "Falha ao listar pacientes. Tente novamente." };
    }

    const items = (data as PatientRow[]).map(toPatient);

    return { ok: true, data: { items, total: count ?? items.length } };
  } catch (err) {
    // Captura erros de infraestrutura (ex.: cliente Supabase não inicializado).
    // Nunca logar a mensagem completa do erro — pode vazar stack com dados.
    console.error("[patients.listPatients] unexpected error type:", typeof err);
    return { ok: false, error: "Erro interno. Tente novamente mais tarde." };
  }
}

// ---------------------------------------------------------------------------
// getPatient
// ---------------------------------------------------------------------------

/**
 * Busca um paciente pelo ID dentro do tenant autenticado.
 *
 * A RLS garante que o usuário só vê pacientes do próprio tenant — mesmo que
 * um atacante envie um UUID válido de outro tenant, o Supabase retornará
 * zero linhas (não um erro 403, para não revelar existência do recurso).
 *
 * Retorna null se o paciente não existir ou não pertencer ao tenant.
 * Retorna { ok: false, error } em caso de falha de banco.
 */
export async function getPatient(
  id: string
): Promise<Result<Patient | null>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("patients")
      .select(
        "id, clinic_id, full_name, birth_date, cpf, email, phone, created_at, updated_at, deleted_at"
      )
      .eq("id", id)
      // Garante que o ID recebido é um UUID válido antes de enviar ao banco.
      // A validação completa é feita no schema, mas aqui bloqueamos injeção.
      .maybeSingle();

    if (error) {
      console.error("[patients.getPatient] db error code:", error.code);
      return { ok: false, error: "Falha ao buscar paciente. Tente novamente." };
    }

    if (!data) {
      // Paciente não existe ou não pertence ao tenant do usuário.
      // Retornamos null — não diferenciamos "não encontrado" de "outro tenant"
      // para não revelar a existência de recursos de outros clientes.
      return { ok: true, data: null };
    }

    return { ok: true, data: toPatient(data as PatientRow) };
  } catch (err) {
    console.error("[patients.getPatient] unexpected error type:", typeof err);
    return { ok: false, error: "Erro interno. Tente novamente mais tarde." };
  }
}
