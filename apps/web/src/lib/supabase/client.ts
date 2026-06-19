/**
 * Supabase browser client — usa @supabase/ssr para auth baseada em cookies.
 *
 * Segurança:
 * - Lê apenas NEXT_PUBLIC_* (anon key). Nunca a service role key.
 * - Chave de serviço fica exclusivamente em server.ts (acesso server-only).
 *
 * Uso: componentes Client ("use client") e hooks do lado do browser.
 */
import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

// Deriva o tipo de retorno diretamente de @supabase/ssr para evitar
// dependência direta em @supabase/supabase-js neste workspace.
type BrowserSupabaseClient = ReturnType<typeof createSSRBrowserClient>;

export function createBrowserClient(): BrowserSupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórios."
    );
  }

  return createSSRBrowserClient(url, anonKey);
}
