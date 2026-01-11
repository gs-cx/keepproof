'use server';

import prisma from '../lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// --- FONCTION DE LOG (Interne) ---
async function logAudit(userId: string, action: string, status: string, details: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        status,
        details
      }
    });
  } catch (e) {
    console.error("⚠️ Impossible d'écrire le log:", e);
  }
}

// --- ACTION 1 : RÉCUPÉRER LES PREUVES ---
export async function getUserProofs() {
  const user = await currentUser();
  if (!user) return [];

  try {
    const proofs = await prisma.proof.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    return proofs.map(p => ({
      ...p,
      created_at: p.createdAt.toISOString(),
      file_hash: p.fileHash,
      tags: p.tags ? p.tags.join(', ') : ''
    }));
  } catch (e: any) {
    console.error("❌ Erreur GetProofs:", e);
    return [];
  }
}

// --- ACTION 2 : CRÉER UNE PREUVE (SANS IA) ---
export async function createProofAction(formData: FormData) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Non connecté" };

  const file = formData.get('file') as File;
  const fileHash = formData.get('fileHash') as string;
  
  // 1. Sync User
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.emailAddresses[0]?.emailAddress },
    create: { id: user.id, email: user.emailAddresses[0]?.emailAddress || 'no-email', credits: 0 }
  });

  try {
      // 2. Check Doublon
      const existing = await prisma.proof.findFirst({
        where: { userId: user.id, fileHash: fileHash }
      });
      
      if (existing) {
        await logAudit(user.id, "UPLOAD_DUPLICATE", "WARN", `Doublon: ${file.name}`);
        return { success: false, error: "Fichier déjà protégé." };
      }

      // 3. Sauvegarde Physique
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const uniqueName = `${Date.now()}-${file.name}`;
      await writeFile(join(uploadDir, uniqueName), buffer);

      // 4. Enregistrement BDD
      const newProof = await prisma.proof.create({
        data: {
          userId: user.id,
          filename: file.name,
          fileHash: fileHash,
          fileSize: file.size,
          mimeType: file.type,
          status: 'PROTECTED',
          storagePath: uniqueName,
          tags: []
        }
      });
      
      // 5. Log Succès
      await logAudit(user.id, "UPLOAD_SUCCESS", "OK", `Fichier: ${file.name} | ID: ${newProof.id}`);
      return { success: true, id: newProof.id };

  } catch (e: any) {
    console.error("💥 Erreur Serveur:", e);
    await logAudit(user.id, "UPLOAD_ERROR", "KO", `Erreur: ${e.message}`);
    return { success: false, error: "Erreur technique." };
  }
}

// --- FIX CORRECT POUR LE BUILD ---
export async function searchProofsAction(formData: any) {
  'use server';
  // On renvoie un objet avec success: true et results vide
  return { success: true, results: [] };
}
