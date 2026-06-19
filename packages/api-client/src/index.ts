/**
 * @harmoni/api-client — cliente Supabase tipado.
 * Regras de segurança:
 *  - A anon key é pública (client). A service role key NUNCA vai ao client.
 *  - O isolamento de tenant é garantido por RLS no banco, não aqui.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/** Cria um client para uso no browser/app (anon key). */
export function createBrowserClient(env: SupabaseEnv): SupabaseClient {
  if (!env.url || !env.anonKey) {
    throw new Error("Supabase: url e anonKey são obrigatórios");
  }
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export type { SupabaseClient };
