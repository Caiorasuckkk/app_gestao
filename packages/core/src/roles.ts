/** Papéis de usuário no contexto de uma clínica (tenant). */
export const ROLES = ["admin", "profissional", "recepcao"] as const;
export type Role = (typeof ROLES)[number];

/** Identificadores de tenant e usuário (uuid). */
export type TenantId = string;
export type UserId = string;

/** Contexto de autenticação resolvido a partir da sessão/JWT. */
export interface AuthContext {
  userId: UserId;
  tenantId: TenantId;
  role: Role;
}

/** Permissões mínimas por papel (defesa em profundidade junto à RLS). */
export function canAccessMedicalRecords(role: Role): boolean {
  return role === "admin" || role === "profissional";
}
