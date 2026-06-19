"use client";

/**
 * PatientForm — formulário compartilhado para criar e editar pacientes.
 *
 * Client Component necessário para react-hook-form + interatividade.
 *
 * Padrão:
 * - react-hook-form + zodResolver (mesmo schema do servidor).
 * - Criação: usa patientCreateSchema (fullName obrigatório).
 * - Edição: usa patientCreateSchema.partial() (todos os campos opcionais).
 * - Submissão via startTransition → server action (createPatient/updatePatient).
 *   CRÍTICO: startTransition é obrigatório ao chamar actions programaticamente
 *   a partir do onSubmit do react-hook-form — sem ele o React emite warning e
 *   o estado de loading quebra (padrão estabelecido no LoginForm; mantido aqui).
 * - Sucesso → router.push("/patients") (revalidatePath está nas actions).
 *
 * Acessibilidade:
 * - Labels explícitos com htmlFor/id.
 * - aria-invalid + aria-describedby nos campos com erro.
 * - aria-live="polite" no erro global do servidor.
 * - aria-busy no botão durante loading.
 * - Campos desabilitados durante submit.
 *
 * LGPD: nunca logar fullName, cpf, email, phone.
 * Segurança: CPF trafega como string de 11 dígitos; a máscara visual é
 * removida antes do submit (unmaskCpf).
 */
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { patientCreateSchema } from "@harmoni/core";
import { createPatient, updatePatient } from "./actions";

// ---------------------------------------------------------------------------
// Schemas e tipos locais
// ---------------------------------------------------------------------------

// Schema completo para criação (fullName obrigatório)
const createSchema = patientCreateSchema;

// Schema parcial para edição (todos opcionais — PATCH semântico)
const editSchema = patientCreateSchema.partial();

// Tipo unificado para os valores do form (union dos dois schemas)
// Usamos o schema parcial como tipo do form em ambos os modos, pois
// zodResolver valida conforme o schema passado — o TypeScript não precisa
// distinguir em compile-time os campos obrigatórios vs opcionais aqui.
type FormValues = z.infer<typeof editSchema>;

// ---------------------------------------------------------------------------
// Tipos de props
// ---------------------------------------------------------------------------

type CreateMode = {
  mode: "create";
  defaultValues?: Partial<FormValues>;
};

type EditMode = {
  mode: "edit";
  patientId: string;
  defaultValues: Partial<FormValues>;
};

type PatientFormProps = CreateMode | EditMode;

// ---------------------------------------------------------------------------
// Helpers de máscara de CPF (apenas visual; o valor do form é só dígitos)
// ---------------------------------------------------------------------------

/** Aplica máscara "000.000.000-00" para exibição no input. */
function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

/** Remove formatação — retorna apenas os 11 dígitos. */
function unmaskCpf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

// ---------------------------------------------------------------------------
// Componente de campo com label e mensagem de erro
// ---------------------------------------------------------------------------

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, required, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
        {required && (
          <span className="text-danger ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[#6B7280] mt-0.5">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Classes base para inputs
// ---------------------------------------------------------------------------

function inputClass(hasError: boolean): string {
  return [
    "w-full h-10 rounded-lg border px-3 py-2 text-sm bg-[#F6F8FA]",
    "text-primary placeholder:text-[#6B7280]",
    "focus:outline-none focus:ring-2 focus:border-primary/40 transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError
      ? "border-danger focus:ring-danger/40"
      : "border-[rgba(31,78,95,0.15)] focus:ring-primary/40",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// PatientForm
// ---------------------------------------------------------------------------

export function PatientForm(props: PatientFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Estado do display do CPF com máscara (separado do valor do form)
  const [cpfDisplay, setCpfDisplay] = useState<string>(
    props.defaultValues?.cpf ? maskCpf(props.defaultValues.cpf) : ""
  );

  const isEdit = props.mode === "edit";
  const activeSchema = isEdit ? editSchema : createSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(activeSchema),
    defaultValues: props.defaultValues ?? {},
    mode: "onBlur",
  });

  // useController para o CPF: permite controle de display com máscara
  // enquanto o valor real (só dígitos) é mantido pelo react-hook-form.
  const {
    field: cpfField,
    fieldState: cpfFieldState,
  } = useController({ name: "cpf", control });

  function onValid(data: FormValues) {
    setServerError(null);
    setIsPending(true);

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updatePatient((props as EditMode).patientId, data)
          : await createPatient(data);

        if (!result.ok) {
          setServerError(result.error);
          setIsPending(false);
          return;
        }

        // Sucesso → volta para a listagem (revalidatePath chamado nas actions)
        router.push("/patients");
      } catch {
        // Captura erros de rede/infraestrutura. Sem logar dados sensíveis.
        setServerError("Erro inesperado. Tente novamente.");
        setIsPending(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className="space-y-5"
      aria-label={
        isEdit
          ? "Formulário de edição de paciente"
          : "Formulário de cadastro de paciente"
      }
    >
      {/* Erro global retornado pela server action */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger"
        >
          {serverError}
        </div>
      )}

      {/* Nome completo */}
      <Field
        id="fullName"
        label="Nome completo"
        required={!isEdit}
        error={errors.fullName?.message}
      >
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Nome do paciente"
          disabled={isPending}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          {...register("fullName")}
          className={inputClass(!!errors.fullName)}
        />
      </Field>

      {/* Data de nascimento */}
      <Field
        id="birthDate"
        label="Data de nascimento"
        error={errors.birthDate?.message}
      >
        <input
          id="birthDate"
          type="date"
          disabled={isPending}
          aria-invalid={!!errors.birthDate}
          aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
          {...register("birthDate")}
          className={inputClass(!!errors.birthDate)}
        />
      </Field>

      {/* CPF — máscara visual via useController; valor real = só dígitos */}
      <Field
        id="cpf"
        label="CPF"
        error={cpfFieldState.error?.message}
        hint="Apenas os 11 dígitos (validado pelo dígito verificador)"
      >
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="000.000.000-00"
          disabled={isPending}
          aria-invalid={!!cpfFieldState.error}
          aria-describedby={cpfFieldState.error ? "cpf-error" : "cpf-hint"}
          value={cpfDisplay}
          onChange={(e) => {
            const masked = maskCpf(e.target.value);
            const raw = unmaskCpf(e.target.value);
            setCpfDisplay(masked);
            // Atualiza o campo controlado pelo react-hook-form (só dígitos)
            cpfField.onChange(raw || undefined);
          }}
          onBlur={cpfField.onBlur}
          ref={cpfField.ref}
          name={cpfField.name}
          className={inputClass(!!cpfFieldState.error)}
          maxLength={14}
        />
      </Field>

      {/* E-mail */}
      <Field id="email" label="E-mail" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="paciente@email.com"
          disabled={isPending}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className={inputClass(!!errors.email)}
        />
      </Field>

      {/* Telefone */}
      <Field id="phone" label="Telefone" error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          disabled={isPending}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
          className={inputClass(!!errors.phone)}
        />
      </Field>

      {/* Botões de ação */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="h-10 px-6 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 active:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-150"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {isEdit ? "Salvando…" : "Cadastrando…"}
            </span>
          ) : isEdit ? (
            "Salvar alterações"
          ) : (
            "Cadastrar paciente"
          )}
        </button>

        <a
          href="/patients"
          className="h-10 px-4 rounded-lg border border-[rgba(31,78,95,0.2)] text-primary text-sm font-medium inline-flex items-center hover:bg-[#F6F8FA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
