import type { Config } from "tailwindcss";
import { colors, radius } from "@harmoni/ui/tokens";

/**
 * Tailwind consome os tokens de @harmoni/ui como fonte de verdade.
 * Evita hex solto no código das telas.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        "primary-foreground": colors.primaryForeground,
        surface: colors.surface,
        danger: colors.danger,
        success: colors.success,
        warning: colors.warning,
      },
      borderRadius: {
        DEFAULT: radius.md,
        lg: radius.lg,
      },
    },
  },
  plugins: [],
};

export default config;
