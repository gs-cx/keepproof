import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // --- MODE SIMULATION (Pour avancer sans blocage) ---
  // On ne se connecte pas vraiment, on renvoie des fausses données positives.
  
  return NextResponse.json({
    success: true,
    message: "🚀 Mode Simulation Activé (Bypass Blockchain)",
    details: {
      network: "Polygon Amoy (Simulé)",
      chainId: "80002",
      currentBlock: 5432199,
      walletStatus: "✅ Portefeuille Simulé (Mode Développeur)",
      balance: "10.0 POL" // On fait semblant d'être riche !
    }
  });
}
