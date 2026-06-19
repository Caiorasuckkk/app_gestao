/**
 * Layout compartilhado do grupo (dashboard) — App Shell.
 *
 * Server Component: lê a sessão no servidor via createServerClient.
 * Se não houver usuário, redireciona para /login (defesa em profundidade;
 * o middleware já faz essa verificação, mas mantemos aqui por segurança).
 *
 * Renderiza:
 * - Sidebar com navegação principal via SidebarNav (Client Component).
 * - Header com e-mail do usuário e botão "Sair" (logoutAction).
 * - Slot {children} para o conteúdo da rota ativa.
 *
 * Acessibilidade:
 * - <aside> e <nav> com aria-label para landmarks de navegação.
 * - <main> com id="main-content" para skip link futuro.
 * - Foco e teclado nativos nos links e botão.
 *
 * Visual: tokens do design system via classes Tailwind.
 * Cores explícitas usam apenas valores do tokens.ts:
 *   primary #1F4E5F · secondary #6FB7A7 · accent #DCEFF3
 *   muted #6B7280 · mutedBackground #F6F8FA
 *   border rgba(31,78,95,0.1)
 */
import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/login/actions";
import { SidebarNav } from "./SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defesa em profundidade — middleware já redireciona, mas validamos aqui.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F6F8FA]">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 bg-white border-r border-[rgba(31,78,95,0.1)] shrink-0"
        aria-label="Menu lateral"
      >
        {/* Logo / marca */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[rgba(31,78,95,0.1)]">
          <div
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
            aria-hidden="true"
          >
            <Activity className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-semibold text-base text-primary">
            Harmoni Care
          </span>
        </div>

        {/* Navegação principal — SidebarNav é CC que usa usePathname() */}
        <nav aria-label="Navegação principal" className="flex-1 px-3 py-4">
          <SidebarNav />
        </nav>

        {/* Rodapé da sidebar — avatar com inicial do e-mail */}
        <div className="px-4 py-4 border-t border-[rgba(31,78,95,0.1)]">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shrink-0"
              aria-hidden="true"
            >
              {user.email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <p className="text-xs text-[#6B7280] truncate flex-1 min-w-0">
              {user.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="h-14 bg-white border-b border-[rgba(31,78,95,0.1)] flex items-center justify-between px-6 shrink-0"
          role="banner"
        >
          {/* Mobile: logo compacto */}
          <div className="flex items-center gap-2 md:hidden">
            <Activity className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-semibold text-sm text-primary">
              Harmoni Care
            </span>
          </div>

          <div className="hidden md:block" aria-hidden="true" />

          {/* Usuário + logout */}
          <div className="flex items-center gap-4">
            <span
              className="text-sm text-[#6B7280] hidden sm:block truncate max-w-[200px]"
              aria-label={`Usuário: ${user.email}`}
            >
              {user.email}
            </span>

            <form action={logoutAction}>
              <button
                type="submit"
                className="h-8 px-3 rounded-lg border border-[rgba(31,78,95,0.2)] text-primary text-sm font-medium hover:bg-[#F6F8FA] active:bg-[rgba(31,78,95,0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        {/* Conteúdo da rota */}
        <main className="flex-1 px-6 py-6 overflow-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
