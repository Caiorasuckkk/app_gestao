"use client";

/**
 * LoginForm — componente Client interativo para a tela de autenticação.
 *
 * Padrão: useActionState (React 19 / Next.js 15) + react-hook-form + Zod.
 * O form integra validação local (react-hook-form) para feedback imediato
 * E submete via Server Action (segurança server-side garantida em actions.ts).
 *
 * Acessibilidade:
 * - Labels explícitos vinculados a cada input (htmlFor/id).
 * - aria-invalid e aria-describedby para estados de erro.
 * - aria-live="polite" na mensagem de erro global (anti-enumeração).
 * - aria-busy no botão durante loading.
 * - Foco gerenciado: erro global recebe foco automático via ref.
 *
 * Tokens visuais: apenas classes Tailwind mapeadas em tailwind.config.ts
 * (primary, surface, danger, etc.). Sem hex solto.
 */
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Activity } from "lucide-react";
import { loginSchema, type LoginInput } from "@harmoni/core";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [serverState, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Move foco para a mensagem de erro global quando ela aparecer.
  useEffect(() => {
    if (serverState.status === "error") {
      errorRef.current?.focus();
    }
  }, [serverState]);

  // handleSubmit do react-hook-form valida localmente antes de disparar a action.
  // Se inválido, mostra erros inline sem round-trip ao servidor.
  function onValid(_data: LoginInput, event?: React.BaseSyntheticEvent) {
    const form = event?.target as HTMLFormElement | undefined;
    if (form) {
      // Cria FormData e dispara a server action programaticamente.
      const formData = new FormData(form);
      void formAction(formData);
    }
  }

  const isDisabled = isPending;

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo — formulário */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo / identidade */}
          <div className="mb-8">
            <a
              href="/"
              className="flex items-center gap-2 mb-8 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Harmoni Care — ir para a página inicial"
            >
              <Activity className="w-8 h-8" aria-hidden="true" />
              <span className="font-semibold text-2xl">Harmoni Care</span>
            </a>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-500">Entre na sua conta para continuar</p>
          </div>

          {/* Erro global do servidor (anti-enumeração — mensagem genérica) */}
          {serverState.status === "error" && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 rounded-lg bg-red-50 border border-danger/30 px-4 py-3"
            >
              <p
                ref={errorRef}
                tabIndex={-1}
                className="text-sm text-danger font-medium outline-none"
              >
                {serverState.message}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onValid)}
            noValidate
            className="space-y-6"
          >
            {/* Campo e-mail */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                disabled={isDisabled}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className={[
                  "w-full h-11 rounded-lg border bg-slate-50 px-3 py-2 text-sm",
                  "text-primary placeholder:text-slate-400",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors",
                  errors.email
                    ? "border-danger focus:ring-danger/50"
                    : "border-slate-200",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-xs text-danger mt-1"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-primary"
                >
                  Senha
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isDisabled}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                  className={[
                    "w-full h-11 rounded-lg border bg-slate-50 px-3 py-2 pr-10 text-sm",
                    "text-primary placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-colors",
                    errors.password
                      ? "border-danger focus:ring-danger/50"
                      : "border-slate-200",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isDisabled}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-xs text-danger mt-1"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botão de submissão */}
            <button
              type="submit"
              disabled={isDisabled}
              aria-busy={isPending}
              className={[
                "w-full h-11 rounded-lg font-medium text-sm text-white",
                "bg-primary hover:bg-primary/90 active:bg-primary/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "transition-all duration-150",
              ].join(" ")}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
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
                  Entrando…
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="text-green-600 hover:text-primary font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito — painel visual (decorativo, oculto em mobile) */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{
          background:
            "linear-gradient(135deg, #1F4E5F 0%, #6FB7A7 60%, #DCEFF3 100%)",
        }}
        aria-hidden="true"
      >
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Gestão completa da sua prática profissional
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Agenda, prontuários eletrônicos, teleconsulta, gestão financeira e
            muito mais em uma única plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
