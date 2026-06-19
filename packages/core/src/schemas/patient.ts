import { z } from "zod";

/**
 * Schema de Paciente — usado para validação no cliente E no servidor.
 * Dado sensível (LGPD). Não logar conteúdo destes campos.
 */
export const patientCreateSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório").max(200),
  birthDate: z.string().date().optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/u, "CPF deve conter 11 dígitos")
    .optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().min(8).max(20).optional(),
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;

export const patientSchema = patientCreateSchema.extend({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type Patient = z.infer<typeof patientSchema>;
