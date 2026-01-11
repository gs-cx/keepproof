import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from "@clerk/localizations";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://keepproof.com'),
  title: {
    default: "KeepProof - La Preuve d'Antériorité par Blockchain",
    template: "%s | KeepProof",
  },
  description: "Protégez vos créations, idées et documents en moins de 30 secondes. Certificat d'antériorité infalsifiable ancré sur la Blockchain Polygon. Conforme eIDAS.",
  keywords: ["Preuve antériorité", "Blockchain", "Copyright", "Droit d'auteur", "Propriété intellectuelle", "Horodatage", "Polygon", "IP Protection"],
  authors: [{ name: "KeepProof Team" }],
  openGraph: {
    title: "KeepProof - Protégez vos idées",
    description: "Ne laissez plus personne voler votre travail. Obtenez une preuve d'antériorité juridique dès maintenant.",
    url: 'https://keepproof.com',
    siteName: 'KeepProof',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "KeepProof - La Preuve Blockchain",
    description: "Protégez vos créations en un clic.",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR as any}>
      <html lang="fr" className="scroll-smooth">
        <body className={inter.className}>
          {children}
          {/* Le Footer est maintenant injecté globalement ici */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
