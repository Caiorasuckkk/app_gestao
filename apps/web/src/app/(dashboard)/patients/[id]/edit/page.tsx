/**
 * Rota: /patients/[id]/edit
 * Server Component — página de edição de paciente existente.
 *
 * Busca o paciente pelo ID no servidor (getPatient).
 * Se não encontrado (null) ou erro, redireciona para /patients.
 * Renderiza PatientForm em modo "edit" com defaultValues preenchidos.
 *
 * A submissão chama updatePatient (server action) via PatientForm.
 * Após sucesso, PatientForm redireciona para /patients.
 *
 * Multi-tenant: a RLS do Supabase garante que getPatient só retorna
 * dados do próprio tenant — um ID de outro tenant retorna null.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPatient } from "@/lib/patients/queries";
import { PatientForm } from "../../PatientForm";

interface EditPatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPatientPage({
  params,
}: EditPatientPageProps) {
  const { id } = await params;

  const result = await getPatient(id);

  // Erro de banco → 404 (não expõe detalhes do erro ao usuário)
  if (!result.ok) {
    notFound();
  }

  // Paciente não existe ou pertence a outro tenant → 404
  if (!result.data) {
    notFound();
  }

  const patient = result.data;

  // Monta defaultValues para o formulário (camelCase → PatientCreate)
  const defaultValues = {
    fullName: patient.fullName,
    birthDate: patient.birthDate,
    cpf: patient.cpf,
    email: patient.email,
    phone: patient.phone,
  };

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
        <h1 className="text-2xl font-bold text-primary">Editar paciente</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Altere os dados e salve as modificações
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-white rounded-lg border border-[rgba(31,78,95,0.1)] p-6">
        <PatientForm
          mode="edit"
          patientId={patient.id}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
}
