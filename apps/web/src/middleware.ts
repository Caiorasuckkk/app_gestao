/**
 * Middleware de autenticação — Harmoni Care Web.
 *
 * Estratégia: ALLOWLIST de rotas públicas.
 * Toda rota não-pública exige sessão. Se o usuário não estiver autenticado,
 * redireciona para /login?next=<pathname>. Usuário autenticado em rota pública
 * de auth vai para /dashboard.
 *
 * Rotas públicas:
 * - /login, /register, /forgot-password (autenticação)
 * - / (raiz — redireciona internamente para /dashboard, sem sessão irá para /login)
 *
 * Segurança:
 * - Nunca logar tokens, sessões ou dados pessoais.
 * - Refresh de sessão via @supabase/ssr a cada request (getUser()).
 * - TODO: rate limiting em /login antes do go-live (Upstash / Vercel Edge).
 *   Ver SECURITY_GUIDELINES.md.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rotas públicas que NÃO exigem sessão.
 * Toda rota ausente desta lista requer autenticação.
 */
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

/**
 * Rotas de autenticação: usuário já autenticado é redirecionado para /dashboard.
 */
const AUTH_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Em desenvolvimento sem env configurado, deixa passar para não travar.
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Propaga novos cookies tanto no request quanto no response.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANTE: getUser() dispara o refresh de token silencioso do @supabase/ssr.
  // Deve ser chamado antes de qualquer decisão de roteamento.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // A raiz "/" não é rota pública nem protegida diretamente —
  // o page.tsx redireciona para /dashboard, que exigirá sessão.
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Usuário não autenticado em rota privada → /login?next=<pathname>
  if (!user && !isPublicRoute && pathname !== "/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    // Preserva a URL de destino para redirect pós-login.
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Usuário autenticado tentando acessar rota de auth → /dashboard
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Força Node.js runtime no middleware (não Edge) para compatibilidade com
// @supabase/ssr, que usa APIs Node.js internamente.
export const runtime = "nodejs";

export const config = {
  matcher: [
    /*
     * Executa em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Arquivos com extensão (imagens, fontes, etc.)
     * - /api/* (route handlers)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
