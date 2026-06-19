/**
 * Design tokens — Harmoni Care.
 *
 * Valores REAIS extraídos do export do Figma Make
 * ("Landing page Harmoni Care/src/styles/theme.css").
 * Variáveis CSS do tema (--primary, --secondary, etc.) foram resolvidas
 * para seus valores literais. Nenhum hex/valor mágico deve viver fora deste arquivo.
 *
 * IMPORTANTE: apps/web/tailwind.config.ts consome:
 *   colors.primary, colors.primaryForeground, colors.surface,
 *   colors.danger, colors.success, colors.warning, radius.md, radius.lg.
 * Não renomear/remover essas chaves.
 */

/**
 * Paleta do tema claro (`:root` em theme.css).
 *
 * Notas de mapeamento Figma → token semântico:
 * - `surface` = --card (#FFFFFF) — superfície de cartões/popovers.
 * - `muted` = --muted-foreground (#6B7280): cor de texto secundário.
 *   O fundo "muted" do Figma (--muted #F6F8FA) vira `mutedBackground`.
 * - `danger` = --destructive (#d4183d).
 * - O tema do Figma NÃO define cores de `success`/`warning`. Foram derivadas
 *   da paleta da marca para cobrir os estados exigidos pelo tailwind.config:
 *   `success` reusa a secundária (verde-água #6FB7A7) e `warning` usa o
 *   --chart-4 (oklch âmbar). Ver "Ambiguidades" no DESIGN_SYSTEM.md.
 */
export const colors = {
  // Marca
  primary: "#1F4E5F",
  primaryForeground: "#FFFFFF",
  secondary: "#6FB7A7",
  secondaryForeground: "#FFFFFF",
  accent: "#DCEFF3",
  accentForeground: "#1F4E5F",

  // Base / superfícies
  background: "#FFFFFF",
  foreground: "#1F4E5F",
  surface: "#FFFFFF", // --card
  surfaceForeground: "#1F4E5F", // --card-foreground
  popover: "#FFFFFF",
  popoverForeground: "#1F4E5F",

  // Neutros / texto
  muted: "#6B7280", // --muted-foreground (texto secundário)
  mutedBackground: "#F6F8FA", // --muted
  border: "rgba(31, 78, 95, 0.1)", // --border
  input: "transparent", // --input
  inputBackground: "#F6F8FA", // --input-background
  switchBackground: "#cbced4", // --switch-background
  ring: "#6FB7A7", // --ring (foco)

  // Estados
  danger: "#d4183d", // --destructive
  dangerForeground: "#FFFFFF", // --destructive-foreground
  success: "#6FB7A7", // derivado da secundária (tema não define)
  warning: "oklch(0.828 0.189 84.429)", // --chart-4 (âmbar; tema não define warning dedicado)

  // Charts (gráficos / relatórios)
  chart1: "#1F4E5F",
  chart2: "#6FB7A7",
  chart3: "#DCEFF3",
  chart4: "oklch(0.828 0.189 84.429)",
  chart5: "oklch(0.769 0.188 70.08)",

  // Sidebar (do tema; valores neutros oklch do export)
  sidebar: "oklch(0.985 0 0)",
  sidebarForeground: "oklch(0.145 0 0)",
  sidebarPrimary: "#030213",
  sidebarPrimaryForeground: "oklch(0.985 0 0)",
  sidebarAccent: "oklch(0.97 0 0)",
  sidebarAccentForeground: "oklch(0.205 0 0)",
  sidebarBorder: "oklch(0.922 0 0)",
  sidebarRing: "oklch(0.708 0 0)",
} as const;

/**
 * Paleta do tema escuro (`.dark` em theme.css).
 * O export define o dark mode quase inteiramente em oklch neutros
 * (escala de cinzas), sem reaproveitar a marca teal. Mantido fiel.
 */
export const colorsDark = {
  primary: "oklch(0.985 0 0)",
  primaryForeground: "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  secondaryForeground: "oklch(0.985 0 0)",
  accent: "oklch(0.269 0 0)",
  accentForeground: "oklch(0.985 0 0)",

  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  surface: "oklch(0.145 0 0)", // --card
  surfaceForeground: "oklch(0.985 0 0)",
  popover: "oklch(0.145 0 0)",
  popoverForeground: "oklch(0.985 0 0)",

  muted: "oklch(0.708 0 0)", // --muted-foreground
  mutedBackground: "oklch(0.269 0 0)", // --muted
  border: "oklch(0.269 0 0)",
  input: "oklch(0.269 0 0)",
  ring: "oklch(0.439 0 0)",

  danger: "oklch(0.396 0.141 25.723)", // --destructive
  dangerForeground: "oklch(0.637 0.237 25.331)",
  success: "oklch(0.696 0.17 162.48)", // derivado (--chart-2 dark, verde)
  warning: "oklch(0.769 0.188 70.08)", // derivado (--chart-3 dark, âmbar)

  chart1: "oklch(0.488 0.243 264.376)",
  chart2: "oklch(0.696 0.17 162.48)",
  chart3: "oklch(0.769 0.188 70.08)",
  chart4: "oklch(0.627 0.265 303.9)",
  chart5: "oklch(0.645 0.246 16.439)",

  sidebar: "oklch(0.205 0 0)",
  sidebarForeground: "oklch(0.985 0 0)",
  sidebarPrimary: "oklch(0.488 0.243 264.376)",
  sidebarPrimaryForeground: "oklch(0.985 0 0)",
  sidebarAccent: "oklch(0.269 0 0)",
  sidebarAccentForeground: "oklch(0.985 0 0)",
  sidebarBorder: "oklch(0.269 0 0)",
  sidebarRing: "oklch(0.439 0 0)",
} as const;

/**
 * Tipografia.
 * O export não declara fonte custom (fonts.css vazio, sem @font-face nem
 * Google Fonts), então herda a stack sans padrão do Tailwind v4.
 * --font-size base = 16px; as escalas --text-* abaixo são as do Tailwind v4
 * usadas pelos elementos base (h1=2xl, h2=xl, h3=lg, h4/label/button/input=base).
 */
export const typography = {
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  baseSize: "16px", // --font-size
  // Escala de tamanhos (Tailwind v4 defaults usados pelo tema)
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px — --text-base (h4, label, button, input)
    lg: "1.125rem", // 18px — --text-lg (h3)
    xl: "1.25rem", // 20px — --text-xl (h2)
    "2xl": "1.5rem", // 24px — --text-2xl (h1)
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  weights: {
    normal: 400, // --font-weight-normal
    medium: 500, // --font-weight-medium
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    // O tema aplica line-height 1.5 a h1-h4, label, button, input.
    tight: 1.25,
    base: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Espaçamento — base 4/8px (sem escala explícita no theme.css do export;
 * derivada da convenção Tailwind/4px usada nos componentes).
 */
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
} as const;

/**
 * Raios. Derivados de --radius: 0.625rem (10px) e dos cálculos do tema:
 *   sm = radius - 4px = 6px
 *   md = radius - 2px = 8px
 *   lg = radius       = 10px
 *   xl = radius + 4px = 14px
 */
export const radius = {
  sm: "6px",
  md: "8px",
  lg: "10px",
  xl: "14px",
  full: "9999px",
} as const;

/**
 * Sombras. O theme.css do export não define tokens de sombra próprios;
 * os componentes usam as utilidades shadow do Tailwind. Mantidos os
 * valores padrão do Tailwind para centralizar e evitar valor mágico solto.
 */
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

export type Tokens = {
  colors: typeof colors;
  colorsDark: typeof colorsDark;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
};
