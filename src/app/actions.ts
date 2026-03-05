'use server';

import prisma from '../lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// --- FONCTION DE LOG (Interne) ---
async function logAudit(userId: string, action: string, status: string, details: string) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, status, details }
    });
  } catch (e) {
    console.error("⚠️ Impossible d'écrire le log:", e);
  }
}

// --- ACTION 1 : RÉCUPÉRER LES PREUVES ---
export async function getUserProofs() {
  try {
    const user = await currentUser();
    if (!user) return [];

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

// --- ACTION 2 : CRÉER UNE PREUVE ---
export async function createProofAction(formData: FormData) {
  console.log("🚀 [Server] Démarrage createProofAction...");
  
  try {
    // 1. Vérification Utilisateur
    const user = await currentUser();
    if (!user) {
        console.log("❌ [Server] Pas d'utilisateur connecté");
        return { success: false, error: "Non connecté" };
    }

    // 2. Récupération des données
    const file = formData.get('file') as File;
    const fileHash = formData.get('fileHash') as string;
    
    if (!file || !fileHash) {
        return { success: false, error: "Données manquantes (Fichier ou Hash)" };
    }

    console.log(`📂 [Server] Fichier reçu: ${file.name} (${file.size} bytes)`);

    // 3. Sync User (Si ça échoue ici, c'est la BDD)
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.emailAddresses[0]?.emailAddress },
      create: { id: user.id, email: user.emailAddresses[0]?.emailAddress || 'no-email', credits: 0 }
    });

    // 4. Check Doublon
    const existing = await prisma.proof.findFirst({
      where: { userId: user.id, fileHash: fileHash }
    });
    
    if (existing) {
      await logAudit(user.id, "UPLOAD_DUPLICATE", "WARN", `Doublon: ${file.name}`);
      return { success: false, error: "Ce fichier est déjà protégé." };
    }

    // 5. Sauvegarde Physique (Disque)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), 'uploads');
    
    // On s'assure que le dossier existe
    await mkdir(uploadDir, { recursive: true });
    
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);
    console.log(`💾 [Server] Fichier écrit sur le disque: ${uniqueName}`);

    // 6. Enregistrement BDD
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
    
    // 7. Log Succès
    await logAudit(user.id, "UPLOAD_SUCCESS", "OK", `Fichier: ${file.name} | ID: ${newProof.id}`);
    console.log("✅ [Server] Succès total");
    
    return { success: true, id: newProof.id };

  } catch (e: any) {
    console.error("💥 [Server] Erreur CRITIQUE:", e);
    // On renvoie une erreur propre au lieu de planter
    return { success: false, error: e.message || "Erreur serveur interne" };
  }
}

// --- ACTION POUR LE BUILD ---
export async function searchProofsAction(formData: any) {
  return { success: true, results: [] };
}
