/**
 * Design tokens — PLACEHOLDER.
 * TODO(design-system): extrair valores reais de
 * "Landing page Harmoni Care/src/styles/{theme,tailwind}.css" e do Figma.
 * Nenhum hex/valor mágico deve viver fora deste arquivo.
 */
export const colors = {
  primary: "#0F766E",
  primaryForeground: "#FFFFFF",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: "Inter, system-ui, sans-serif",
  sizes: { caption: "12px", body: "14px", h3: "18px", h2: "24px", h1: "32px" },
} as const;

export type Tokens = {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};
