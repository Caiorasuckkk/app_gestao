# DESIGN_SYSTEM — Harmoni Care

> Mantido pelo agente `design-system`. Fonte: export do Figma ("Landing page Harmoni Care") como referência visual.

## Princípios
- Tokens centralizados em `packages/ui`. Nenhum hex/valor mágico em componente.
- Componentes web em shadcn/ui; tokens compartilhados com mobile.
- Todo componente cobre: default, hover, focus-visible, active, disabled, loading, erro, vazio.
- Acessibilidade AA: contraste, foco visível, aria, teclado.

## Tokens

Fonte: `Landing page Harmoni Care/src/styles/theme.css`. Valores resolvidos
(variáveis CSS `--*` traduzidas para literais) vivem em `packages/ui/src/tokens.ts`.

### Cores — tema claro (`colors`)
A marca é teal/verde-água. Token semântico → valor real:

| Token | Valor | Origem (Figma) |
|---|---|---|
| `primary` | `#1F4E5F` | `--primary` |
| `primaryForeground` | `#FFFFFF` | `--primary-foreground` |
| `secondary` | `#6FB7A7` | `--secondary` |
| `secondaryForeground` | `#FFFFFF` | `--secondary-foreground` |
| `accent` | `#DCEFF3` | `--accent` |
| `accentForeground` | `#1F4E5F` | `--accent-foreground` |
| `background` | `#FFFFFF` | `--background` |
| `foreground` | `#1F4E5F` | `--foreground` |
| `surface` | `#FFFFFF` | `--card` |
| `surfaceForeground` | `#1F4E5F` | `--card-foreground` |
| `popover` / `popoverForeground` | `#FFFFFF` / `#1F4E5F` | `--popover*` |
| `muted` | `#6B7280` | `--muted-foreground` (texto secundário) |
| `mutedBackground` | `#F6F8FA` | `--muted` |
| `border` | `rgba(31, 78, 95, 0.1)` | `--border` |
| `input` / `inputBackground` | `transparent` / `#F6F8FA` | `--input` / `--input-background` |
| `switchBackground` | `#cbced4` | `--switch-background` |
| `ring` | `#6FB7A7` | `--ring` (foco) |
| `danger` | `#d4183d` | `--destructive` |
| `dangerForeground` | `#FFFFFF` | `--destructive-foreground` |
| `success` | `#6FB7A7` | derivado da secundária (tema não define) |
| `warning` | `oklch(0.828 0.189 84.429)` | `--chart-4` âmbar (tema não define) |
| `chart1..chart5` | ver tokens.ts | `--chart-1..5` |
| `sidebar*` | escala oklch neutra | `--sidebar*` |

### Cores — tema escuro (`colorsDark`)
O export define `.dark` quase só em **oklch neutros** (escala de cinzas); não
reaproveita o teal. Reproduzido fiel em `colorsDark`. Ex.: `background`
`oklch(0.145 0 0)`, `foreground` `oklch(0.985 0 0)`, `primary` `oklch(0.985 0 0)`,
`danger` `oklch(0.396 0.141 25.723)`.

### Tipografia
- **Família:** não há fonte custom no export (`fonts.css` vazio, sem `@font-face`
  nem Google Fonts) → herda a stack sans padrão do Tailwind v4.
- **Base:** `16px` (`--font-size`).
- **Escala (Tailwind v4):** xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36 px.
- **Mapeamento de elementos no tema:** h1 = 2xl, h2 = xl, h3 = lg, h4/label/button/input = base.
- **Pesos:** normal 400 (`--font-weight-normal`), medium 500 (`--font-weight-medium`), semibold 600, bold 700.
- **Line-height:** 1.5 em h1-h4/label/button/input (token `lineHeights.base`).

### Espaçamento
Base 4/8px (não há escala explícita no `theme.css`; derivada da convenção): xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 px.

### Raio
Derivado de `--radius: 0.625rem` (10px): `sm` 6 · `md` 8 · `lg` 10 · `xl` 14 px · `full` 9999.

### Sombra
O export não define tokens de sombra; usa as utilidades `shadow-*` do Tailwind.
Centralizado em `shadows` (sm/md/lg/xl) com os valores padrão do Tailwind.

### Ambiguidades encontradas
- `success` e `warning` **não existem** no tema do Figma; foram derivados
  (success = secundária; warning = `--chart-4`) para satisfazer o
  `tailwind.config.ts`. Revisar quando o Figma definir estados dedicados.
- `--chart-4/5` já vêm em oklch no próprio tema claro (mistura hex + oklch).
- Dark mode não usa a marca teal (só neutros), o que diverge visualmente do light.

## Componentes base (a construir)
Button, Input, Select, Checkbox, Radio, Switch, Textarea, Card, Dialog, Drawer, Tabs, Table, Badge, Avatar, Toast, Tooltip, EmptyState, Skeleton.

## Mapeamento Figma → componente

### Telas (export `src/app/pages/`)
| Tela (Figma) | Destino (app web) | Status |
|---|---|---|
| DashboardHome | `app/(dashboard)` home | a reconstruir |
| Agenda | módulo Agenda | a reconstruir |
| Pacientes | módulo Pacientes | a reconstruir |
| Prontuarios | módulo Prontuários | a reconstruir |
| Teleconsulta | módulo Teleconsulta | a reconstruir |
| Financeiro | módulo Financeiro | a reconstruir |
| NotasFiscais | módulo Notas Fiscais | a reconstruir |
| Equipes | módulo Equipes | a reconstruir |
| Relatorios | módulo Relatórios | a reconstruir |
| Configuracoes | módulo Configurações | a reconstruir |
| LandingPage / Login / Register / Onboarding | público/auth | a reconstruir |

### Componentes ui/ presentes no export (`src/app/components/ui/`)
Export gerado em Radix + MUI; **todos a reconstruir** em shadcn/ui limpo com tokens compartilhados.

| Componente (export) | Status |
|---|---|
| button, input, textarea, label, checkbox, radio-group, switch, select, slider, toggle, toggle-group | a reconstruir |
| card, badge, avatar, separator, skeleton, progress, aspect-ratio | a reconstruir |
| dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip, dropdown-menu, context-menu, menubar, command | a reconstruir |
| tabs, accordion, collapsible, table, pagination, breadcrumb, navigation-menu, sidebar, scroll-area, resizable, carousel | a reconstruir |
| alert, sonner (toast), form, input-otp, calendar, chart | a reconstruir |
