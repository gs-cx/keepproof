import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Configuration du mode maintenance
const MAINTENANCE_MODE = true; 

// 2. Définir les routes publiques (accessibles sans connexion)
const isPublicRoute = createRouteMatcher([
  "/",
  "/search",          
  "/api/search",      
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

  // --- LOGIQUE MAINTENANCE ---
  if (MAINTENANCE_MODE) {
    const isAdminBypass = req.cookies.get('maintenance_bypass')?.value === 'true';
    const isAllowedPath = 
      url.pathname.startsWith('/maintenance') || 
      url.pathname.startsWith('/magic') ||
      url.pathname.startsWith('/chain-test') ||
      url.pathname.startsWith('/api') ||       
      url.pathname.startsWith('/search') ||    
      url.pathname.startsWith('/_next') || 
      url.pathname.includes('.'); 

    if (!isAdminBypass && !isAllowedPath) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }
  }
  // ---------------------------

  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
