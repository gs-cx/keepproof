"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? "text-blue-500" : "text-gray-300 hover:text-white";

  return (
    <nav className="bg-[#050507] border-b border-white/10 fixed w-full z-50 top-0 left-0 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold text-xl">K</div>
              <span className="text-xl font-bold text-white tracking-tight">KeepProof</span>
            </Link>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className={`${isActive('/')} px-3 py-2 rounded-md font-medium transition-colors`}>
              Accueil
            </Link>
            <Link href="/pricing" className={`${isActive('/pricing')} px-3 py-2 rounded-md font-medium transition-colors`}>
              Tarifs
            </Link>
            <Link href="/faq" className={`${isActive('/faq')} px-3 py-2 rounded-md font-medium transition-colors`}>
              Questions (FAQ)
            </Link>
            
            <div className="h-6 w-px bg-white/20 mx-2"></div>

            {/* Si l'utilisateur est CONNECTÉ : Affiche lien Dashboard + Profil */}
            <SignedIn>
                <Link href="/dashboard" className={`${isActive('/dashboard')} px-3 py-2 rounded-md font-medium transition-colors`}>
                  Tableau de bord
                </Link>
                <div className="ml-4">
                  <UserButton afterSignOutUrl="/"/>
                </div>
            </SignedIn>

            {/* Si l'utilisateur est DÉCONNECTÉ : Affiche bouton Connexion */}
            <SignedOut>
                <Link href="/sign-in" className="bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105">
                  Connexion
                </Link>
            </SignedOut>
          </div>

          {/* BOUTON BURGER (Mobile) */}
          <div className="flex items-center md:hidden">
            {/* On affiche aussi le UserButton sur mobile à côté du burger si connecté */}
            <SignedIn>
              <div className="mr-4">
                <UserButton afterSignOutUrl="/"/>
              </div>
            </SignedIn>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0A0F] border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              Accueil
            </Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              Tarifs
            </Link>
            <Link href="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              FAQ
            </Link>
            
            <SignedIn>
               <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-white/5">
                  Accéder au Tableau de bord
               </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsOpen(false)} className="block w-full text-center mt-4 px-5 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500">
                Connexion
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
