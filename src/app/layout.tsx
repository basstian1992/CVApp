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
  title: "CV Gratis - Crea y Haz tu Currículum Vitae en Chile",
  description: "Crea tu Currículum Vitae gratis en 1 minuto. App intuitiva con Inteligencia Artificial para destacar tu perfil, buscar trabajo, empleo y encontrar cursos de capacitación gratis en Chile.",
  keywords: [
    "Curriculum", "crear curriculum", "hacer curriculum", "curriculum gratis", 
    "cv", "curriculum chile", "trabajo", "capacitación gratis", 
    "cursos gratis de capacitación", "curso gratis", "empleo", "buscar empleo",
    "cv con inteligencia artificial", "plantillas de curriculum"
  ],
  authors: [{ name: "CVGratis.cl" }],
  creator: "CVGratis.cl",
  publisher: "CVGratis.cl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CV Gratis - Crea tu Currículum Vitae en Chile',
    description: 'Crea tu Currículum Vitae gratis en 1 minuto. Usa Inteligencia Artificial para destacar tu perfil, buscar trabajo y cursos de capacitación gratuitos en Chile.',
    url: 'https://cvgratis.cl',
    siteName: 'CV Gratis',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: 'https://cvgratis.cl/logo.png',
        width: 800,
        height: 600,
        alt: 'CV Gratis Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Gratis - Crea tu Currículum Vitae en Chile',
    description: 'Crea tu Currículum Vitae gratis en 1 minuto. App intuitiva con Inteligencia Artificial para destacar tu perfil profesional en Chile.',
    images: ['https://cvgratis.cl/logo.png'],
  },
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
