"use server";

/**
 * Server Actions de autenticação — login e logout.
 *
 * Segurança:
 * - Validação Zod no servidor (nunca confiar apenas no cliente).
 * - Mensagem de erro GENÉRICA para falha de login (anti-enumeração de usuários).
 *   Não diferenciamos "e-mail não encontrado" de "senha incorreta".
 *   Ver SECURITY_GUIDELINES.md: "Proteção contra enumeração de usuários".
 * - TODO: rate limiting em login antes do go-live. O Supabase Auth tem proteção
 *   built-in, mas adicionar Upstash/Vercel Edge Rate Limit para camada extra.
 *   Ver SECURITY_GUIDELINES.md → "Rate limiting em login".
 * - NUNCA logar email, senha ou tokens. Dado pessoal (LGPD art. 11).
 */
import { redirect } from "next/navigation";
import { loginSchema } from "@harmoni/core";
import { createServerClient } from "@/lib/supabase/server";

export type LoginState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

/**
 * Mensagem genérica usada em qualquer falha de autenticação.
 * Não revela se o e-mail existe ou não (anti-enumeração).
 */
const GENERIC_LOGIN_ERROR =
  "E-mail ou senha inválidos. Verifique seus dados e tente novamente.";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // 1. Extrai e valida os dados (validação server-side obrigatória).
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    // Retorna erro de validação genérico — não expõe detalhes internos.
    return { status: "error", message: GENERIC_LOGIN_ERROR };
  }

  // 2. Tenta autenticar via Supabase Auth.
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Mensagem GENÉRICA — não diferencia e-mail inválido de senha errada.
    // O Supabase já aplica rate limiting interno; não logar o erro original
    // (pode conter dados pessoais ou pistas de enumeração).
    return { status: "error", message: GENERIC_LOGIN_ERROR };
  }

  // 3. Sucesso — redireciona para o dashboard.
  // redirect() lança internamente; não precisa de return após.
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
