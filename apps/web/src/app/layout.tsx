import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harmoni Care",
  description: "Gestão de clínicas de saúde multidisciplinares",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
