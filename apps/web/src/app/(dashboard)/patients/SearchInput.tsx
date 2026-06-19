"use client";

/**
 * SearchInput — campo de busca que atualiza o parâmetro ?q= na URL.
 *
 * Client Component necessário para interatividade (onChange + router.push).
 * Debounce de 400ms para evitar navegações excessivas enquanto o usuário digita.
 * O Server Component pai (page.tsx) lê ?q= e faz o fetch no servidor.
 *
 * Acessibilidade:
 * - <label> visualmente oculta mas presente para leitores de tela.
 * - role="search" no wrapper.
 * - aria-label no input.
 */
import { useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

const DEBOUNCE_MS = 400;

export function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      // Reseta para página 1 ao buscar
      params.delete("page");

      startTransition(() => {
        router.push(`/patients?${params.toString()}`);
      });
    }, DEBOUNCE_MS);
  }

  return (
    <div role="search" className="flex-1 relative">
      <label htmlFor="patient-search" className="sr-only">
        Buscar paciente por nome
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="patient-search"
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Buscar por nome..."
        aria-label="Buscar paciente por nome"
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-[rgba(31,78,95,0.15)] bg-[#F6F8FA] text-sm text-primary placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
      />
    </div>
  );
}
