/**
 * Rota: /dashboard (placeholder)
 * Server Component protegido — exige sessão ativa (middleware.ts garante).
 *
 * Lê o usuário no servidor via createServerClient (cookie-based session).
 * Se por algum motivo a sessão for inválida mesmo passando pelo middleware,
 * redireciona explicitamente para /login (defesa em profundidade).
 *
 * TODO: substituir por layout.tsx de dashboard real com sidebar quando
 * os módulos (Agenda, Pacientes, etc.) estiverem implementados.
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/login/actions";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defesa em profundidade: middleware já bloqueou, mas validamos aqui também.
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg"
            aria-hidden="true"
          >
            {user.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              Sessão ativa
            </p>
            <p className="text-sm font-semibold text-primary truncate max-w-[240px]">
              {user.email}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-2">
          Olá, {user.email}
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Dashboard em construção. Autenticação SSR funcionando corretamente.
        </p>

        {/* Logout via Server Action */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full h-10 rounded-lg border border-danger/40 text-danger text-sm font-medium hover:bg-red-50 active:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </main>
  );
}
