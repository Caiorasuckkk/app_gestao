"use server";

/**
 * actions.ts — Mutations de pacientes (Server Actions).
 *
 * SEGURANÇA / MULTI-TENANT:
 * - "use server": executadas exclusivamente no servidor Next.js.
 * - Usa createServerClient (anon key + sessão via cookie), NUNCA service role.
 * - A RLS aplica automaticamente:
 *     INSERT: policy patients_insert_same_clinic → WITH CHECK (clinic_id = auth_clinic_id())
 *     UPDATE: policy patients_update_same_clinic → USING + WITH CHECK
 *     DELETE: policy patients_no_hard_delete → using(false) — hard delete bloqueado
 *   O código NÃO passa clinic_id nas operações: o DEFAULT da coluna
 *   (auth_clinic_id(), setado em 0003_clinic_id_defaults.sql) preenche no INSERT,
 *   e a RLS garante que UPDATE/softDelete só afetam linhas do próprio tenant.
 * - Validação Zod no servidor em toda mutation (nunca confiar no cliente).
 * - NÃO logar fullName, cpf, email ou phone — dados sensíveis LGPD art. 11.
 * - Erros do Postgres são sanitizados — mensagens seguras retornadas ao cliente.
 *
 * POR QUE NÃO PASSAR clinic_id:
 *   Após a migration 0003, patients.clinic_id tem DEFAULT = auth_clinic_id().
 *   A policy WITH CHECK garante que o clinic_id (seja via default ou enviado
 *   explicitamente) corresponda ao tenant do usuário autenticado. Não enviar
 *   clinic_id simplifica o código e elimina a superfície de adulteração desse
 *   campo no payload.
 */

import { revalidatePath } from "next/cache";
import { patientCreateSchema } from "@harmoni/core";
import type { Patient } from "@harmoni/core";
import { createServerClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/patients/queries";

// ---------------------------------------------------------------------------
// Tipos internos (mapeamento snake_case → camelCase)
// ---------------------------------------------------------------------------

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
// Schema de atualização parcial (subset de patientCreateSchema)
// ---------------------------------------------------------------------------

// patientCreateSchema cobre todos os campos mutáveis.
// Para update, todos os campos são opcionais (PATCH semântico).
const patientUpdateSchema = patientCreateSchema.partial();

// ---------------------------------------------------------------------------
// createPatient
// ---------------------------------------------------------------------------

/**
 * Cria um novo paciente no tenant do usuário autenticado.
 *
 * - Valida o input com patientCreateSchema (Zod, server-side).
 * - NÃO envia clinic_id: o DEFAULT do banco (auth_clinic_id()) preenche.
 * - A policy patients_insert_same_clinic garante que o tenant é respeitado.
 * - Retorna o paciente criado (com id e timestamps) ou um erro tipado.
 *
 * @param input Dados do paciente (camelCase, validado antes de enviar ao banco).
 */
export async function createPatient(
  input: unknown
): Promise<Result<Patient>> {
  // 1. Validação server-side — nunca confiar no payload do cliente.
  const parsed = patientCreateSchema.safeParse(input);
  if (!parsed.success) {
    // Retorna o primeiro erro de validação. Não expõe stack trace.
    // Os erros de Zod não contêm os valores dos campos (apenas caminhos),
    // então é seguro retornar a mensagem.
    const firstError = parsed.error.errors[0];
    const message = firstError
      ? `${firstError.path.join(".")}: ${firstError.message}`
      : "Dados inválidos.";
    return { ok: false, error: message };
  }

  const { fullName, birthDate, cpf, email, phone } = parsed.data;

  try {
    const supabase = await createServerClient();

    // INSERT sem clinic_id — o banco preenche via DEFAULT auth_clinic_id().
    // A RLS WITH CHECK valida que o valor resolvido corresponde ao tenant.
    // snake_case para o banco; camelCase para a aplicação (mapeado abaixo).
    const { data, error } = await supabase
      .from("patients")
      .insert({
        full_name: fullName,
        birth_date: birthDate ?? null,
        // Campos sensíveis opcionais: null explícito quando ausente.
        // NUNCA logar estes valores.
        cpf: cpf ?? null,
        email: email ?? null,
        phone: phone ?? null,
      })
      .select(
        "id, clinic_id, full_name, birth_date, cpf, email, phone, created_at, updated_at, deleted_at"
      )
      .single();

    if (error) {
      // Mapeia erros conhecidos do Postgres para mensagens seguras.
      if (error.code === "23505") {
        // Unique violation — provavelmente CPF duplicado no tenant.
        // Não revelamos qual campo causou o conflito para não confirmar
        // dados de outro paciente.
        return {
          ok: false,
          error: "Já existe um paciente com esses dados no sistema.",
        };
      }
      // Para outros erros de banco, logamos apenas o código (sem dados).
      console.error("[patients.createPatient] db error code:", error.code);
      return {
        ok: false,
        error: "Falha ao cadastrar paciente. Tente novamente.",
      };
    }

    // Invalida o cache da listagem para que a página reflita o novo registro.
    revalidatePath("/patients");

    return { ok: true, data: toPatient(data as PatientRow) };
  } catch (err) {
    console.error("[patients.createPatient] unexpected error type:", typeof err);
    return { ok: false, error: "Erro interno. Tente novamente mais tarde." };
  }
}

// ---------------------------------------------------------------------------
// updatePatient
// ---------------------------------------------------------------------------

/**
 * Atualiza campos permitidos de um paciente do tenant autenticado.
 *
 * - Validação parcial com patientUpdateSchema (todos os campos são opcionais).
 * - Campos não enviados não são alterados (PATCH semântico).
 * - A RLS USING + WITH CHECK garante que apenas pacientes do próprio tenant
 *   são atualizados. Se `id` não pertencer ao tenant, o Supabase retorna
 *   zero linhas afetadas (não erro), o que é mapeado para "não encontrado".
 * - clinic_id não pode ser alterado via UPDATE (sem esse campo no payload).
 * - deleted_at não pode ser alterado por esta action (usar softDeletePatient).
 *
 * @param id UUID do paciente a atualizar.
 * @param input Campos a atualizar (parcial, camelCase).
 */
export async function updatePatient(
  id: string,
  input: unknown
): Promise<Result<Patient>> {
  // 1. Validação parcial server-side.
  const parsed = patientUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    const message = firstError
      ? `${firstError.path.join(".")}: ${firstError.message}`
      : "Dados inválidos.";
    return { ok: false, error: message };
  }

  // Garante que ao menos um campo foi enviado para atualizar.
  const { fullName, birthDate, cpf, email, phone } = parsed.data;
  const hasUpdate =
    fullName !== undefined ||
    birthDate !== undefined ||
    cpf !== undefined ||
    email !== undefined ||
    phone !== undefined;

  if (!hasUpdate) {
    return { ok: false, error: "Nenhum campo para atualizar foi fornecido." };
  }

  // Monta objeto de atualização apenas com os campos presentes.
  // undefined não é incluído no payload do Supabase (não altera a coluna).
  const updatePayload: Record<string, string | null> = {};
  if (fullName !== undefined) updatePayload["full_name"] = fullName;
  if (birthDate !== undefined) updatePayload["birth_date"] = birthDate ?? null;
  // Campos sensíveis: null explícito quando enviado como undefined após partial.
  // Se o campo veio como undefined (ausente no payload), não incluímos —
  // assim o valor existente no banco é preservado.
  if (cpf !== undefined) updatePayload["cpf"] = cpf ?? null;
  if (email !== undefined) updatePayload["email"] = email ?? null;
  if (phone !== undefined) updatePayload["phone"] = phone ?? null;

  try {
    const supabase = await createServerClient();

    // UPDATE sem clinic_id: a RLS USING (clinic_id = auth_clinic_id()) garante
    // que somente linhas do tenant do usuário são afetadas.
    const { data, error } = await supabase
      .from("patients")
      .update(updatePayload)
      .eq("id", id)
      .select(
        "id, clinic_id, full_name, birth_date, cpf, email, phone, created_at, updated_at, deleted_at"
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // single() não encontrou linha — paciente inexistente ou de outro tenant.
        return {
          ok: false,
          error: "Paciente não encontrado.",
        };
      }
      if (error.code === "23505") {
        return {
          ok: false,
          error: "Já existe um paciente com esses dados no sistema.",
        };
      }
      console.error("[patients.updatePatient] db error code:", error.code);
      return {
        ok: false,
        error: "Falha ao atualizar paciente. Tente novamente.",
      };
    }

    // Invalida cache da listagem e da página de edição.
    revalidatePath("/patients");

    return { ok: true, data: toPatient(data as PatientRow) };
  } catch (err) {
    console.error("[patients.updatePatient] unexpected error type:", typeof err);
    return { ok: false, error: "Erro interno. Tente novamente mais tarde." };
  }
}

// ---------------------------------------------------------------------------
// softDeletePatient
// ---------------------------------------------------------------------------

/**
 * Marca um paciente como deletado (soft delete via deleted_at = now()).
 *
 * NÃO realiza hard delete — a policy patients_no_hard_delete (using false)
 * bloqueia DELETE no banco independentemente de quem chamar.
 *
 * A retenção dos dados é exigida pelo CFM por no mínimo 20 anos.
 * Exclusão definitiva (hard delete) é processo controlado pelo DPO via
 * service role — nunca exposto ao usuário final.
 *
 * A RLS USING garante que apenas pacientes do próprio tenant são afetados.
 * Se `id` não pertencer ao tenant, a operação não afeta linhas (silenciosa).
 *
 * @param id UUID do paciente a marcar como deletado.
 */
export async function softDeletePatient(
  id: string
): Promise<Result<{ id: string }>> {
  try {
    const supabase = await createServerClient();

    // Atualiza deleted_at; RLS aplica filtro de tenant automaticamente.
    // Usamos .single() para detectar o caso de "não encontrado" (zero linhas).
    const { data, error } = await supabase
      .from("patients")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      // Garante que só pacientes ativos podem ser deletados (idempotência
      // defensiva — evita re-setar deleted_at em paciente já deletado).
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[patients.softDeletePatient] db error code:", error.code);
      return {
        ok: false,
        error: "Falha ao remover paciente. Tente novamente.",
      };
    }

    if (!data) {
      // Paciente não existe, já foi deletado, ou pertence a outro tenant.
      // Não diferenciamos os casos para não vazar informação sobre outros tenants.
      return {
        ok: false,
        error: "Paciente não encontrado ou já foi removido.",
      };
    }

    // Invalida cache da listagem para remover o paciente inativado.
    revalidatePath("/patients");

    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    console.error(
      "[patients.softDeletePatient] unexpected error type:",
      typeof err
    );
    return { ok: false, error: "Erro interno. Tente novamente mais tarde." };
  }
}
