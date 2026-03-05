#!/bin/bash

# --- COULEURS POUR LE DIAGNOSTIC ---
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}      🩺  KEEPPROOF DOCTOR v1.0       ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Base du code source
SRC_DIR="/app/src"

# Compteur d'erreurs
ERRORS=0

# --- FONCTION DE VÉRIFICATION ---
check_file() {
    FILE_PATH="$1"
    EXPECTED_CONTENT="$2"
    LABEL="$3"

    echo -n "Vérification $LABEL... "

    # 1. Est-ce que le fichier existe ?
    if [ ! -f "$FILE_PATH" ]; then
        echo -e "${RED}[MANQUANT]${NC}"
        echo -e "   ↳ Chemin attendu : $FILE_PATH"
        ((ERRORS++))
        return
    fi

    # 2. Est-ce qu'on peut le lire ? (Permissions)
    if [ ! -r "$FILE_PATH" ]; then
        echo -e "${RED}[DROITS REFUSÉS]${NC}"
        ((ERRORS++))
        return
    fi

    # 3. Est-ce qu'il est vide ?
    if [ ! -s "$FILE_PATH" ]; then
        echo -e "${RED}[FICHIER VIDE]${NC}"
        ((ERRORS++))
        return
    fi

    # 4. Est-ce que le contenu semble cohérent ?
    if grep -q "$EXPECTED_CONTENT" "$FILE_PATH"; then
        echo -e "${GREEN}[OK]${NC}"
    else
        echo -e "${YELLOW}[CONTENU SUSPECT]${NC}"
        echo -e "   ↳ Le fichier existe mais ne contient pas : '$EXPECTED_CONTENT'"
        ((ERRORS++))
    fi
}

# --- DÉBUT DU SCAN ---

echo -e "${YELLOW}📂 1. VÉRIFICATION DU NOYAU (BACKEND)${NC}"
check_file "$SRC_DIR/lib/prisma.ts" "PrismaClient" "Connecteur BDD (prisma.ts)"
check_file "$SRC_DIR/app/actions.ts" "use server" "Cerveau (actions.ts)"
echo ""

echo -e "${YELLOW}🌐 2. VÉRIFICATION DES PAGES (FRONTEND)${NC}"
check_file "$SRC_DIR/app/new/page.tsx" "Nouvelle Protection" "Page Dépôt (/new)"
check_file "$SRC_DIR/app/dashboard/page.tsx" "Mes Preuves" "Dashboard (/dashboard)"
check_file "$SRC_DIR/app/cgu/page.tsx" "Conditions Générales" "Page Juridique (/cgu)"
echo ""

echo -e "${YELLOW}🧩 3. VÉRIFICATION DES COMPOSANTS${NC}"
check_file "$SRC_DIR/components/Header.tsx" "header" "En-tête (Header)"
check_file "$SRC_DIR/components/Footer.tsx" "footer" "Pied de page (Footer)"
echo ""

echo -e "${YELLOW}💾 4. VÉRIFICATION DU STOCKAGE PHYSIQUE${NC}"
echo -n "Dossier Uploads (/app/uploads)... "
if [ -d "/app/uploads" ]; then
    if [ -w "/app/uploads" ]; then
        echo -e "${GREEN}[OK]${NC} (Accessible en écriture)"
    else
        echo -e "${RED}[ERREUR DROITS]${NC} (Impossible d'écrire dedans !)"
        ((ERRORS++))
    fi
else
    echo -e "${RED}[MANQUANT]${NC} (Le dossier n'existe pas)"
    # Tentative de réparation automatique
    echo -n "   ↳ Tentative de création... "
    mkdir -p /app/uploads
    echo -e "${GREEN}Créé.${NC}"
fi
echo ""

# --- BILAN ---
echo -e "${BLUE}========================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ SYSTÈME SAIN. TOUT EST OPÉRATIONNEL.${NC}"
else
    echo -e "${RED}❌ ATTENTION : $ERRORS PROBLÈME(S) DÉTECTÉ(S).${NC}"
fi
echo -e "${BLUE}========================================${NC}"
