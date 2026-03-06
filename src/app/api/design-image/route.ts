import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // La lecture directe sur le disque local (fs/path) est interdite sur Cloudflare Edge.
  // Cette route est neutralisée en attendant la connexion au vrai stockage (OVH/S3).
  return new NextResponse("Image non disponible sur le stockage local", { status: 404 });
}
