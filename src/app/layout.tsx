import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // <--- 1. Import du Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KeepProof",
  description: "Protégez vos créations par la Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          
          {/* Menu en haut */}
          <Navbar />
          
          {/* Contenu principal */}
          <main className="pt-20 min-h-screen bg-[#050507]">
            {children}
          </main>
          
          {/* Pied de page réintégré ici */}
          <Footer /> 
          
        </body>
      </html>
    </ClerkProvider>
  );
}
