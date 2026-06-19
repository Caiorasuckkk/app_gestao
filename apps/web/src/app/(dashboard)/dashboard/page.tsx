/**
 * Rota: /dashboard
 * Server Component — home do app shell.
 *
 * O logout e o e-mail do usuário agora vivem no layout compartilhado
 * (dashboard)/layout.tsx. Esta página serve como boas-vindas e ponto de
 * entrada para os módulos do sistema.
 *
 * Sem re-leitura de sessão aqui — o layout já verificou e redireciona
 * para /login se necessário (defesa em profundidade no layout).
 */
import Link from "next/link";
import { Users, Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Bem-vindo ao Harmoni Care. Selecione um módulo para começar.
        </p>
      </div>

      {/* Atalhos de módulos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/patients"
          className="group flex items-center gap-4 p-5 bg-white rounded-lg border border-[rgba(31,78,95,0.1)] hover:border-primary/30 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Ir para módulo de Pacientes"
        >
          <div
            className="w-10 h-10 rounded-lg bg-[#DCEFF3] flex items-center justify-center group-hover:bg-primary/10 transition-colors"
            aria-hidden="true"
          >
            <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Pacientes</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Cadastro e gestão
            </p>
          </div>
        </Link>

        {/* Placeholder — Agenda (a implementar) */}
        <div
          className="flex items-center gap-4 p-5 bg-white rounded-lg border border-[rgba(31,78,95,0.1)] opacity-50 cursor-not-allowed"
          aria-label="Módulo de Agenda (em breve)"
          role="article"
        >
          <div
            className="w-10 h-10 rounded-lg bg-[#DCEFF3] flex items-center justify-center"
            aria-hidden="true"
          >
            <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Agenda</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}
