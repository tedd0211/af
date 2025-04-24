import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuração da fonte Inter com múltiplos pesos
const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'], // Regular, Medium, SemiBold, Bold
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Biblioteca de Conteúdos",
  description: "Plataforma para visualização e download de cortes de filmes e séries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`bg-gray-950 ${inter.variable}`}>
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>{children}</body>
    </html>
  );
}
