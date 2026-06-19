import { z } from "zod";

/**
 * Schema de autenticação — compartilhado entre web e mobile.
 *
 * Regras de segurança (SECURITY_GUIDELINES.md):
 * - Senha mínima de 8 caracteres (Supabase Auth já valida no servidor,
 *   mas validamos aqui para feedback imediato sem round-trip).
 * - Nunca logar email ou senha — dados pessoais/credenciais.
 * - Mensagem de erro do servidor deve ser GENÉRICA (anti-enumeração).
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
