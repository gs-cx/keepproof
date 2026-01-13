const { ethers } = require("ethers");

// Création d'un nouveau portefeuille
const wallet = ethers.Wallet.createRandom();

console.log("");
console.log("=======================================================");
console.log("1. POUR LE FAUCET ALCHEMY (C'est votre Adresse Publique)");
console.log("   Copiez la ligne ci-dessous (commence par 0x) :");
console.log("=======================================================");
console.log(wallet.address);
console.log("");
console.log("");
console.log("=======================================================");
console.log("2. POUR VOTRE FICHIER .ENV (C'est votre Clé Privée)");
console.log("   Copiez la ligne ci-dessous :");
console.log("=======================================================");
console.log(wallet.privateKey);
console.log("");
