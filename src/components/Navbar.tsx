"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  // Détection du scroll pour l'effet de flou
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // LISTE DES LIENS DU MENU
  const navLinks = [
    { name: 'Technologie', href: '/technology' },
    { name: 'Questions', href: '/faq' },
    { name: 'Blog', href: '/blog' },     // <--- C'EST ICI QUE NOUS AVONS AJOUTÉ LE LIEN
    { name: 'Tarifs', href: '/pricing' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#050507]/80 backdrop-blur-md border-white/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Keep<span className="text-blue-500">Proof</span>
          </span>
        </Link>

        {/* MENU BUREAU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === link.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* BOUTONS DROITE (CONNEXION) */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/"/>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-bold text-white hover:text-gray-300">
                Connexion
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-transform hover:scale-105 flex items-center gap-1"
              >
                Commencer <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* MENU MOBILE (HAMBURGER) */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* VUE MOBILE DÉPLIANTE */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0A0A0F] border-b border-white/10 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-blue-400 py-2 border-b border-white/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
             {!isSignedIn && (
                <Link 
                  href="/sign-up" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold text-center"
                >
                  Créer un compte
                </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
