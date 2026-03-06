import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // L'ancienne connexion directe à PostgreSQL (pg) a été retirée.
  // Ce point d'accès renvoie un tableau vide pour ne pas faire planter l'interface.
  // Les vraies recherches passent désormais par le moteur OVH.
  return NextResponse.json([]);
}
