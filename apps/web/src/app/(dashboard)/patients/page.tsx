/**
 * Rota: /patients
 * Server Component — listagem de pacientes do tenant autenticado.
 *
 * Lê searchParams (?q= para busca, ?page= para paginação) e chama
 * listPatients no servidor. Renderiza a tabela com estados explícitos:
 * loading (Suspense/streaming), erro (Result.ok===false), vazio e sucesso.
 *
 * LGPD: não logamos busca, nome, e-mail ou telefone.
 * Multi-tenant: RLS do Supabase garante isolamento; não passamos clinic_id.
 *
 * Paginação: simples, baseada em offset/limit com links de navegação.
 */
import Link from "next/link";
import { Suspense } from "react";
import { Plus, Pencil, Phone, Mail } from "lucide-react";
import { listPatients } from "@/lib/patients/queries";
import { SearchInput } from "./SearchInput";
import { DeletePatientButton } from "./DeletePatientButton";

const PAGE_SIZE = 20;

interface PatientsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

/** Formata data ISO para exibição em pt-BR (sem hora). */
function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
  } catch {
    return "—";
  }
}

/** Gera iniciais a partir de um nome completo (máx. 2 letras). */
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => (n[0] ?? "").toUpperCase())
    .join("");
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const result = await listPatients({ search: q, limit: PAGE_SIZE, offset });

  const totalPages =
    result.ok ? Math.ceil(result.data.total / PAGE_SIZE) : 1;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pacientes</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gerencie o cadastro de pacientes da clínica
          </p>
        </div>
        <Link
          href="/patients/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0"
          aria-label="Cadastrar novo paciente"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Novo paciente
        </Link>
      </div>

      {/* Barra de busca */}
      <div className="flex gap-3 items-center">
        <Suspense fallback={null}>
          <SearchInput defaultValue={q} />
        </Suspense>
      </div>

      {/* Estado: erro de dados */}
      {!result.ok && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-red-50 px-5 py-4 text-sm text-danger"
        >
          <p className="font-medium">Erro ao carregar pacientes</p>
          <p className="mt-1 text-danger/80">{result.error}</p>
        </div>
      )}

      {/* Estado: sucesso */}
      {result.ok && (
        <>
          {/* Estado: lista vazia */}
          {result.data.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-lg border border-[rgba(31,78,95,0.1)]">
              <div
                className="w-16 h-16 rounded-full bg-[#DCEFF3] flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1F4E5F"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-primary">
                  {q
                    ? "Nenhum paciente encontrado"
                    : "Nenhum paciente cadastrado"}
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  {q
                    ? `Nenhum resultado para "${q}". Tente outros termos.`
                    : "Comece cadastrando o primeiro paciente da clínica."}
                </p>
              </div>
              {!q && (
                <Link
                  href="/patients/new"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Cadastrar primeiro paciente
                </Link>
              )}
            </div>
          )}

          {/* Estado: sucesso com dados */}
          {result.data.items.length > 0 && (
            <div className="bg-white rounded-lg border border-[rgba(31,78,95,0.1)] overflow-hidden">
              {/* Contador */}
              <div className="px-5 py-3 border-b border-[rgba(31,78,95,0.07)] bg-[#F6F8FA]">
                <p className="text-xs text-[#6B7280]">
                  {result.data.total}{" "}
                  {result.data.total === 1
                    ? "paciente encontrado"
                    : "pacientes encontrados"}
                  {q && ` para "${q}"`}
                </p>
              </div>

              {/* Tabela — responsiva via scroll horizontal */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Lista de pacientes">
                  <thead>
                    <tr className="border-b border-[rgba(31,78,95,0.07)]">
                      <th
                        scope="col"
                        className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide"
                      >
                        Paciente
                      </th>
                      <th
                        scope="col"
                        className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide hidden sm:table-cell"
                      >
                        Contato
                      </th>
                      <th
                        scope="col"
                        className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide hidden md:table-cell"
                      >
                        Nascimento
                      </th>
                      <th
                        scope="col"
                        className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(31,78,95,0.06)]">
                    {result.data.items.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-[#F6F8FA] transition-colors"
                      >
                        {/* Paciente: avatar + nome */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full bg-[#6FB7A7] flex items-center justify-center text-white text-xs font-semibold shrink-0"
                              aria-hidden="true"
                            >
                              {getInitials(patient.fullName)}
                            </div>
                            <span className="font-medium text-primary">
                              {patient.fullName}
                            </span>
                          </div>
                        </td>

                        {/* Contato */}
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <div className="space-y-1">
                            {patient.email && (
                              <div className="flex items-center gap-1.5 text-[#6B7280]">
                                <Mail
                                  className="w-3.5 h-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="text-xs truncate max-w-[160px]">
                                  {patient.email}
                                </span>
                              </div>
                            )}
                            {patient.phone && (
                              <div className="flex items-center gap-1.5 text-[#6B7280]">
                                <Phone
                                  className="w-3.5 h-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="text-xs">{patient.phone}</span>
                              </div>
                            )}
                            {!patient.email && !patient.phone && (
                              <span className="text-xs text-[#6B7280]">—</span>
                            )}
                          </div>
                        </td>

                        {/* Data de nascimento */}
                        <td className="px-5 py-4 hidden md:table-cell text-[#6B7280] text-xs">
                          {formatDate(patient.birthDate)}
                        </td>

                        {/* Ações */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/patients/${patient.id}/edit`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/70 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded transition-colors"
                              aria-label={`Editar paciente`}
                            >
                              <Pencil
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              Editar
                            </Link>
                            <DeletePatientButton
                              patientId={patient.id}
                              patientLabel={patient.fullName}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <nav
                  aria-label="Paginação de pacientes"
                  className="flex items-center justify-between px-5 py-3 border-t border-[rgba(31,78,95,0.07)] bg-[#F6F8FA]"
                >
                  <p className="text-xs text-[#6B7280]">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link
                        href={`/patients?${new URLSearchParams({
                          ...(q ? { q } : {}),
                          page: String(page - 1),
                        })}`}
                        className="h-8 px-3 rounded-lg border border-[rgba(31,78,95,0.15)] text-xs font-medium text-primary hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                        aria-label="Página anterior"
                      >
                        Anterior
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/patients?${new URLSearchParams({
                          ...(q ? { q } : {}),
                          page: String(page + 1),
                        })}`}
                        className="h-8 px-3 rounded-lg border border-[rgba(31,78,95,0.15)] text-xs font-medium text-primary hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                        aria-label="Próxima página"
                      >
                        Próxima
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
