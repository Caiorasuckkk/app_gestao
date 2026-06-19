/**
 * Rota: /login
 * Server Component — renderiza o LoginForm (Client Component).
 *
 * Esta camada pode ser expandida futuramente para:
 * - Ler parâmetros de query (?next=) e passá-los ao form.
 * - Adicionar metadata SEO (noindex para telas de auth).
 */
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar — Harmoni Care",
  description: "Acesse sua conta Harmoni Care",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
