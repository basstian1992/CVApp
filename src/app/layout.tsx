import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CVProvider } from "@/context/CVContext";
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
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 transition-colors duration-300`}
      >
        <CVProvider>
          {children}
        </CVProvider>
      </body>
    </html>
  );
}
