import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright à gauche */}
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} KeepProof. Tous droits réservés.
          </div>

          {/* Liens légaux à droite */}
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              CGU
            </Link>
            <Link href="mailto:contact@keepproof.com" className="text-sm text-gray-500 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
