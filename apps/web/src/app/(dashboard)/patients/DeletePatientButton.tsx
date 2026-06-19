"use client";

/**
 * DeletePatientButton — botão de inativação de paciente com confirmação.
 *
 * Client Component para gerenciar o dialog de confirmação e o estado
 * de loading durante a chamada da server action softDeletePatient.
 *
 * - Mostra dialog nativo window.confirm (simples; dialog acessível pode ser
 *   melhorado com shadcn/ui AlertDialog quando o componente estiver disponível).
 * - Chama softDeletePatient dentro de startTransition para não bloquear o React.
 * - Exibe erro inline se a action retornar ok: false.
 *
 * Acessibilidade:
 * - aria-label descritivo com o nome da ação (passado pelo pai).
 * - aria-busy durante loading.
 * - Mensagem de erro com role="alert".
 */
import { useState, useTransition } from "react";
import { softDeletePatient } from "./actions";

interface DeletePatientButtonProps {
  patientId: string;
  /** Apenas para o aria-label; não exibir no DOM visível (privacidade). */
  patientLabel: string;
}

export function DeletePatientButton({
  patientId,
  patientLabel,
}: DeletePatientButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      "Tem certeza que deseja inativar este paciente? Esta ação pode ser revertida pelo administrador."
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await softDeletePatient(patientId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={`Inativar paciente ${patientLabel}`}
        className="text-xs font-medium text-danger hover:text-danger/80 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-1 rounded transition-colors"
      >
        {isPending ? "Inativando…" : "Inativar"}
      </button>
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </span>
  );
}
