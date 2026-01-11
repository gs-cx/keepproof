import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050507] text-gray-500 py-10 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <p className="text-sm">
          © {new Date().getFullYear()} KeepProof. Tous droits réservés.
        </p>

        <div className="flex flex-wrap justify-center gap-8 items-center">
          {/* Nouveau lien mis en avant */}
          <Link href="/litige" className="text-sm text-white font-bold hover:text-blue-400 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Guide Litige
          </Link>

          <Link href="/privacy" className="text-sm hover:text-white transition-colors">
            Confidentialité
          </Link>
          
          <Link href="/cgu" className="text-sm hover:text-white transition-colors">
            CGU
          </Link>
          
          <a href="mailto:contact@keepproof.com" className="text-sm hover:text-white transition-colors">
            Contact
          </a>
        </div>
        
      </div>
    </footer>
  );
}
