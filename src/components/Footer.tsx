"use client";

import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/5 pt-16 pb-12 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* GRILLE : 3 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
            
            {/* COLONNE 1 : PRODUIT */}
            <div>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Produit</h4>
                <ul className="space-y-3">
                    <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs & Packs</Link></li>
                    <li><Link href="/how-it-works" className="hover:text-white transition-colors">Comment ça marche</Link></li>
                    <li><Link href="/blockchain" className="hover:text-blue-400 transition-colors flex items-center justify-center md:justify-start gap-2">Technologie <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 rounded">Info</span></Link></li>
                    <li><Link href="/verify" className="hover:text-white transition-colors">Vérifier une preuve</Link></li>
                </ul>
            </div>

            {/* COLONNE 2 : JURIDIQUE */}
            <div>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Juridique</h4>
                <ul className="space-y-3">
                    <li><Link href="/litige" className="hover:text-white transition-colors">Centre de Litige</Link></li>
                    <li><Link href="/legal/mentions" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                    <li><Link href="/legal/cgu" className="hover:text-white transition-colors">CGV / CGU</Link></li>
                    <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                </ul>
            </div>

            {/* COLONNE 3 : SUPPORT */}
            <div>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Besoin d'aide ?</h4>
                <p className="mb-4 text-xs">Notre équipe support vous répond en moins de 4h ouvrées.</p>
                <a href="mailto:support@creaguard.com" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg px-4 py-2 text-white transition-all text-xs font-bold">
                    <Mail className="w-3 h-3" /> Contacter le support
                </a>
            </div>
        </div>

        {/* BOTTOM BAR : Disclaimer + Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-end gap-6 justify-between">
            <p className="text-[10px] text-gray-600 text-justify leading-relaxed max-w-4xl">
                <strong>Avertissement Légal :</strong> Creaguard fournit un service technique d'horodatage et d'ancrage sur Blockchain publique (Polygon). 
                Ce service constitue un commencement de preuve par écrit au sens du Code Civil et respecte les normes de la Convention de Berne. 
                Creaguard n'est pas un cabinet d'avocats.
            </p>
            <div className="text-[10px] text-gray-500 whitespace-nowrap">
                © 2026 Creaguard SAS.
            </div>
        </div>

      </div>
    </footer>
  );
}
