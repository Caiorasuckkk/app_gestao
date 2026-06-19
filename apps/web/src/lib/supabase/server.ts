/**
 * Supabase server client — usa @supabase/ssr com cookies() do Next.js.
 *
 * Segurança:
 * - Usado APENAS em Server Components, Server Actions e Route Handlers.
 * - NUNCA importar este módulo em código client ("use client").
 * - Lê apenas NEXT_PUBLIC_* para o cliente público (anon key).
 *   A service role key (SUPABASE_SERVICE_ROLE_KEY) é exclusiva de
 *   operações administrativas server-side e não é usada aqui.
 *
 * O @supabase/ssr cuida do refresh de tokens via Set-Cookie automático;
 * o middleware (middleware.ts) é responsável por propagar a sessão.
 */
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Deriva o tipo de retorno diretamente de @supabase/ssr para evitar
// dependência direta em @supabase/supabase-js neste workspace.
type ServerSupabaseClient = ReturnType<typeof createSSRServerClient>;

export async function createServerClient(): Promise<ServerSupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórios."
    );
  }

  const cookieStore = await cookies();

  return createSSRServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Em Server Components o setAll é no-op (read-only context).
          // O middleware é responsável pelo refresh e Set-Cookie.
        }
      },
    },
  });
}
