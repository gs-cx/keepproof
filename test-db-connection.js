const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Tentative de connexion à la Base de Données...');
  try {
    await prisma.$connect();
    console.log('✅ SUCCÈS : La connexion fonctionne parfaitement !');
    const userCount = await prisma.user.count();
    console.log('📊 Info : Il y a ' + userCount + ' utilisateurs dans la base.');
  } catch (e) {
    console.error('❌ ÉCHEC : Impossible de se connecter.');
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
