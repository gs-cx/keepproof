import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from "@clerk/localizations";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creaguard - Protection & Preuve Numérique",
  description: "Protégez vos créations, idées et droits d'auteur instantanément.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR as any}>
      <html lang="fr">
        <body className={`${inter.className} min-h-screen flex flex-col bg-[#0a0a0c] text-white`}>
          
          {/* 1. HEADER (Menu) */}
          <Header />
          
          {/* 2. CONTENU PRINCIPAL */}
          <div className="flex-grow">
            {children}
          </div>
          
          {/* 3. FOOTER (Pied de page) */}
          <Footer />
          
        </body>
      </html>
    </ClerkProvider>
  );
}
