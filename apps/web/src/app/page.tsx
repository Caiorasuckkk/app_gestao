import { colors } from "@harmoni/ui/tokens";
import { ROLES } from "@harmoni/core";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
          Harmoni Care
        </h1>
        <p className="mt-2 text-slate-600">
          Monorepo de fundação no ar. Web + packages compartilhados conectados.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Papéis carregados de @harmoni/core: {ROLES.join(", ")}
        </p>
      </div>
    </main>
  );
}
