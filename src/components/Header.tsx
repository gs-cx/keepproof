'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();

  // 🔐 SÉCURITÉ ABSOLUE : Votre ID Unique
  // Seul cet utilisateur verra le bouton Admin.
  const ADMIN_USER_ID = "user_381yR07zMwzc9jb2bVDzWusynYj";

  const isAdmin = isSignedIn && user?.id === ADMIN_USER_ID;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:scale-110 transition-transform">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-white">KeepProof</span>
          </Link>

          {/* NAVIGATION CENTRALE */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Accueil
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Tarifs
            </Link>
            <Link href="/faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Questions
            </Link>
          </nav>

          {/* ACTIONS DROITE */}
          <div className="flex items-center gap-6">
            
            {isSignedIn ? (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Mes Preuves
                </Link>

                {/* BOUTON ADMIN (Visible uniquement pour VOUS) */}
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 border border-red-500/20 px-3 py-1 rounded-full bg-red-500/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="8" r="3"/></svg>
                    Admin
                  </Link>
                )}
                
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Se connecter
                  </button>
                </SignInButton>
                
                <Link href="/new" className="hidden sm:block px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  Commencer
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
