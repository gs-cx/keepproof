"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, ArrowRight, Lock, HelpCircle } from 'lucide-react';

export default function Header() {
  const { isSignedIn } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // On cache le menu sur le Dashboard et le Tunnel pour focus total
  const isAppPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/new');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isAppPage || mobileMenuOpen ? 'bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO CREAGUARD */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">C</div>
          <span className="font-bold text-xl text-white tracking-tight">Creaguard</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        {!isAppPage && (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
                Comment ça marche
            </Link>
            
            <Link href="/admin" className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                <Lock className="w-3 h-3" /> Admin
            </Link>

            <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                Blog
            </Link>

            <Link href="/pricing" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Tarifs
            </Link>

            <Link href="/faq" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Des questions ?
            </Link>
          </nav>
        )}

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              {!pathname?.startsWith('/dashboard') && (
                  <Link href="/dashboard" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                    Dashboard
                  </Link>
              )}
              <UserButton afterSignOutUrl="/"/>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Connexion
              </Link>
              <Link href="/sign-up" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                Commencer <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0a0a0c] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5 shadow-2xl">
          {!isAppPage && (
             <>
                <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-white/5">Comment ça marche</Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-red-400 py-2 border-b border-white/5 flex items-center gap-2"><Lock className="w-3 h-3"/> Administration</Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-white/5">Blog</Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-white/5">Tarifs</Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-blue-400 font-bold py-2 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Des questions ?</Link>
             </>
          )}
          
          <div className="mt-4 pt-4 border-t border-white/10">
            {isSignedIn ? (
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-white font-bold">Dashboard</Link>
                    <UserButton afterSignOutUrl="/"/>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <Link href="/sign-in" className="text-center py-2 text-gray-300 hover:text-white">Se connecter</Link>
                    <Link href="/sign-up" className="bg-white text-black text-center py-3 rounded-xl font-bold">Commencer</Link>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
