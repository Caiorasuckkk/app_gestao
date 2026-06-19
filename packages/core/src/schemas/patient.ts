import { z } from "zod";

/**
 * Valida o dígito verificador de um CPF de 11 dígitos (sem formatação).
 *
 * Algoritmo oficial da Receita Federal:
 *  1. Multiplica os 9 primeiros dígitos por pesos decrescentes (10..2) e soma.
 *  2. Resto da divisão por 11: se < 2 => primeiro dígito verificador = 0,
 *     senão = 11 - resto.
 *  3. Repete com os 10 primeiros dígitos por pesos decrescentes (11..2) para
 *     o segundo dígito verificador.
 *  4. CPFs com todos os dígitos iguais (ex.: "00000000000") são inválidos.
 *
 * Campo opcional: retorna true para undefined/null (compatibilidade mantida).
 * NUNCA logar o valor do CPF — dado sensível LGPD art. 11.
 */
function isValidCpf(cpf: string): boolean {
  // Rejeita sequências trivialmente inválidas (todos dígitos iguais).
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  // Primeiro dígito verificador.
  const sum1 = digits
    .slice(0, 9)
    .reduce((acc, d, i) => acc + d * (10 - i), 0);
  const rem1 = sum1 % 11;
  const check1 = rem1 < 2 ? 0 : 11 - rem1;
  if (digits[9] !== check1) return false;

  // Segundo dígito verificador.
  const sum2 = digits
    .slice(0, 10)
    .reduce((acc, d, i) => acc + d * (11 - i), 0);
  const rem2 = sum2 % 11;
  const check2 = rem2 < 2 ? 0 : 11 - rem2;
  return digits[10] === check2;
}

/**
 * Schema de criação de paciente — usado para validação no cliente E no servidor.
 *
 * LGPD (art. 11): fullName, cpf, email e phone são dados pessoais/sensíveis.
 * NUNCA logar o conteúdo destes campos em logs de aplicação ou banco.
 *
 * patientCreateSchema é a interface pública de criação; mantida compatível
 * com versões anteriores (campos opcionais permanecem opcionais).
 */
export const patientCreateSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório").max(200),
  birthDate: z.string().date().optional(),
  // cpf: 11 dígitos sem formatação. Dado sensível — não logar.
  // Validação B2: além do formato (11 dígitos), verifica dígito verificador
  // pelo algoritmo da Receita Federal. Campo opcional — compatibilidade mantida.
  cpf: z
    .string()
    .regex(/^\d{11}$/u, "CPF deve conter 11 dígitos")
    .refine(isValidCpf, "CPF inválido (dígito verificador incorreto)")
    .optional(),
  // email: dado pessoal — não logar.
  email: z.string().email("E-mail inválido").optional(),
  // phone: dado pessoal — não logar.
  phone: z.string().min(8).max(20).optional(),
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;

/**
 * Schema completo de paciente — inclui campos gerados pelo servidor.
 * Reflete exatamente as colunas da tabela `patients` (0001_init.sql).
 *
 * updatedAt e deletedAt adicionados para casar com o schema do banco.
 * deletedAt = null indica registro ativo (soft delete).
 */
export const patientSchema = patientCreateSchema.extend({
  id: z.string().uuid(),
  // tenantId espelha clinic_id do banco; convenção camelCase no cliente.
  tenantId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  // null = ativo; string datetime = soft-deleted.
  deletedAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export type Patient = z.infer<typeof patientSchema>;
