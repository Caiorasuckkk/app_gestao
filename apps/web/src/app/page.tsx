/**
 * Rota: / (raiz)
 * Ponto de entrada do app. Redireciona para o dashboard; o middleware
 * encaminha para /login quando não há sessão ativa.
 */
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
