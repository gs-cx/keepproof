import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Configuration du mode maintenance
const MAINTENANCE_MODE = true; // METTRE À "false" POUR OUVRIR LE SITE

// 2. Définir les routes publiques (accessibles sans connexion)
const isPublicRoute = createRouteMatcher([
  "/",
  "/maintenance",
  "/magic",
  "/chain-test",
  "/technology",
  "/security",
  "/comparatif",
  "/contact",
  "/cgu",
  "/privacy",
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;

console.log(`[MIDDLEWARE] Requête reçue sur : ${url.pathname}`);

  // --- LOGIQUE MAINTENANCE ---
  if (MAINTENANCE_MODE) {
    // Vérifier si c'est vous (via le cookie magique)
    const isAdminBypass = req.cookies.get('maintenance_bypass')?.value === 'true';

    // Chemins toujours autorisés (Page maintenance, API, Assets techniques)
    const isAllowedPath = 
      url.pathname.startsWith('/maintenance') || 
      url.pathname.startsWith('/magic') ||
      url.pathname.startsWith('/chain-test') ||
      url.pathname.startsWith('/_next') || 
      url.pathname.includes('.'); // fichiers (images, css...)

    // Si Maintenance active + Pas Admin + Pas chemin autorisé -> REDIRECTION
    if (!isAdminBypass && !isAllowedPath) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }
  }
  // ---------------------------

  // --- LOGIQUE PROTECTION CLERK ---
  // Si la route n'est pas publique, on exige la connexion
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
