/**
 * Rota: /patients/new
 * Server Component — página de cadastro de novo paciente.
 *
 * Renderiza o PatientForm em modo "create" sem defaultValues.
 * A submissão chama createPatient (server action) via PatientForm.
 * Após sucesso, PatientForm redireciona para /patients.
 */
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PatientForm } from "../PatientForm";

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Breadcrumb / navegação */}
      <nav aria-label="Caminho de navegação">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Voltar para Pacientes
        </Link>
      </nav>

      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Novo paciente</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Preencha os dados para cadastrar um novo paciente
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-white rounded-lg border border-[rgba(31,78,95,0.1)] p-6">
        <PatientForm mode="create" />
      </div>
    </div>
  );
}
