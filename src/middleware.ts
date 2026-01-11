import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Définition des routes publiques
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/ai',           // <--- CIBLE PRINCIPALE
  '/', 
  '/faq',
  '/tarifs'
]);

export default clerkMiddleware((auth, req) => {
  // 1. TRACE : On affiche quelle page est demandée
  console.log(`🕵️ [Middleware] Requête entrante : ${req.method} ${req.nextUrl.pathname}`);

  if (isPublicRoute(req)) {
    console.log(`✅ [Middleware] Route PUBLIQUE détectée : ${req.nextUrl.pathname} -> ACCÈS AUTORISÉ`);
    return NextResponse.next();
  } else {
    console.log(`🔒 [Middleware] Route PRIVÉE : ${req.nextUrl.pathname} -> Vérification Auth...`);
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Exclure les fichiers statiques (images, css...) pour ne pas polluer les logs
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
