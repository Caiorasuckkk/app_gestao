/**
 * Middleware de autenticação — Harmoni Care Web.
 *
 * Responsabilidades:
 * 1. Refresh de sessão: @supabase/ssr propaga tokens via cookies a cada request,
 *    garantindo que Server Components e Server Actions sempre vejam sessão válida.
 * 2. Proteção de rotas: caminhos sob /(dashboard) exigem sessão ativa.
 *    Usuário sem sessão é redirecionado para /login (preservando callbackUrl).
 * 3. Redirect de usuário autenticado: acesso a /login redireciona para o dashboard.
 *
 * Segurança:
 * - Nunca logar tokens ou dados de sessão.
 * - TODO: rate limiting em /login deve ser implementado na camada de borda
 *   (Vercel Edge Config + Upstash) antes do go-live. Ver SECURITY_GUIDELINES.md.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rotas que exigem autenticação (prefixos). */
const PROTECTED_PREFIXES = ["/dashboard"];

/** Rotas de autenticação (redirect se já autenticado). */
const AUTH_ROUTES = ["/login"];

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

  // IMPORTANTE: não chamar getUser() antes de refreshSession — o @supabase/ssr
  // precisa que getUser() seja chamado para disparar o refresh de token silencioso.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // Sem sessão tentando acessar rota protegida → /login
  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    // Preserva a URL de destino para redirect pós-login.
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Autenticado tentando acessar /login → dashboard
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Força Node.js runtime no middleware (não Edge) para compatibilidade com
// @supabase/ssr, que usa APIs Node.js (process.version) internamente.
// Ver: https://nextjs.org/docs/app/api-reference/file-conventions/middleware
export const runtime = "nodejs";

export const config = {
  matcher: [
    /*
     * Executa em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Arquivos com extensão (imagens, fontes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
