import { z } from "zod";

/**
 * Valores válidos de status de um agendamento.
 * Espelho do enum `appointment_status` definido no banco (0001_init.sql).
 */
export const APPOINTMENT_STATUS = [
  "agendado",
  "confirmado",
  "cancelado",
  "realizado",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];

/**
 * Objeto base dos campos de criação — sem refine, para permitir .extend()
 * posterior sem perder os métodos de ZodObject (refine retorna ZodEffects,
 * que não expõe .extend()/.omit()).
 */
const appointmentCreateBase = z.object({
  patientId: z.string().uuid("patient_id deve ser um UUID válido"),
  professionalId: z.string().uuid("professional_id deve ser um UUID válido"),
  startsAt: z
    .string()
    .datetime({ offset: true, message: "starts_at deve ser ISO 8601 com timezone" }),
  endsAt: z
    .string()
    .datetime({ offset: true, message: "ends_at deve ser ISO 8601 com timezone" }),
  status: z.enum(APPOINTMENT_STATUS).default("agendado"),
  // notes: pode conter dado clínico sensível (LGPD). NÃO logar este campo.
  notes: z.string().max(2000).optional(),
});

/**
 * Schema de criação de agendamento — validação no servidor (e reutilizável
 * no cliente). Campos de tenant (clinic_id) e auditoria (id, created_at) são
 * derivados pelo servidor; não devem ser enviados pelo cliente.
 */
export const appointmentCreateSchema = appointmentCreateBase.refine(
  (data) => new Date(data.endsAt) > new Date(data.startsAt),
  { message: "ends_at deve ser posterior a starts_at", path: ["endsAt"] },
);

export type AppointmentCreate = z.infer<typeof appointmentCreateSchema>;

/**
 * Schema completo de agendamento — inclui campos gerados pelo servidor.
 * Usado para tipar respostas da API e para validação de entrada em
 * route handlers que recebem o objeto completo.
 */
export const appointmentSchema = appointmentCreateBase
  .extend({
    id: z.string().uuid(),
    clinicId: z.string().uuid(),
    // status sem default no schema completo (valor já vem do banco).
    status: z.enum(APPOINTMENT_STATUS),
    createdAt: z.string().datetime({ offset: true }),
  })
  .refine(
    (data) => new Date(data.endsAt) > new Date(data.startsAt),
    { message: "ends_at deve ser posterior a starts_at", path: ["endsAt"] },
  );

export type Appointment = z.infer<typeof appointmentSchema>;

/**
 * Schema para atualização parcial de agendamento (PATCH).
 * Apenas campos mutáveis pelo usuário; clinic_id e patient_id são imutáveis
 * após criação (alteração exige cancelamento + novo agendamento).
 */
export const appointmentUpdateSchema = z
  .object({
    startsAt: z.string().datetime({ offset: true }).optional(),
    endsAt: z.string().datetime({ offset: true }).optional(),
    status: z.enum(APPOINTMENT_STATUS).optional(),
    professionalId: z.string().uuid().optional(),
    // notes: pode conter dado clínico sensível (LGPD). NÃO logar este campo.
    notes: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt !== undefined && data.endsAt !== undefined) {
        return new Date(data.endsAt) > new Date(data.startsAt);
      }
      return true;
    },
    { message: "ends_at deve ser posterior a starts_at", path: ["endsAt"] },
  );

export type AppointmentUpdate = z.infer<typeof appointmentUpdateSchema>;
