#!/bin/bash

# On se place dans le dossier
cd /root/frontend

# 1. On télécharge les nouveautés de l'année en cours
# (Pas besoin de relancer l'historique complet, ça ne bouge pas)
/root/.nvm/versions/node/v20.19.6/bin/node scripts/download-designs.js >> /var/log/inpi_update.log 2>&1

# 2. On lance l'importation (qui va détecter les nouveaux fichiers)
/root/.nvm/versions/node/v20.19.6/bin/node scripts/import-designs-final.js >> /var/log/inpi_update.log 2>&1

# 3. Petit message de confirmation (optionnel)
echo "Mise à jour INPI terminée le $(date)" >> /var/log/inpi_update.log
