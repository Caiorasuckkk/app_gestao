"use client";

/**
 * SidebarNav — Client Component para navegação lateral.
 *
 * Client Component necessário exclusivamente para usePathname()
 * (detectar rota ativa e aplicar aria-current="page").
 * Sem estado extra, sem fetching — apenas roteamento visual.
 *
 * Acessibilidade:
 * - Links nativos via next/link com aria-current="page" na rota ativa.
 * - Foco visível com ring (focus-visible).
 * - Ícones decorativos com aria-hidden="true".
 *
 * Cores: apenas tokens do DS (primary, accent, muted, mutedBackground).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  /** Comparação exata de pathname (true) ou por prefixo (false). */
  exact?: boolean;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    exact: true,
    icon: <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />,
  },
  {
    label: "Pacientes",
    href: "/patients",
    exact: false,
    icon: <Users className="w-4 h-4 shrink-0" aria-hidden="true" />,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1" role="list">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-offset-1",
                isActive
                  ? "bg-[#DCEFF3] text-primary"
                  : "text-[#6B7280] hover:bg-[#F6F8FA] hover:text-primary",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
