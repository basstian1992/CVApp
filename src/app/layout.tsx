import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CVProvider } from "@/context/CVContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVApp - Currículum Gratis en 1 minuto",
  description: "Crea tu Currículum Vitae gratis en 1 minuto. App intuitiva con ayuda de Inteligencia Artificial para destacar tu perfil profesional en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CVProvider>
            {children}
          </CVProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
