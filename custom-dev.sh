#!/bin/bash

# Arrêter tous les processus Next.js en cours
echo "🛑 Arrêt des processus en cours..."
pkill -f "node" || true

# Nettoyage radical
echo "🧹 Nettoyage radical des caches et fichiers temporaires..."
rm -rf .next
rm -rf node_modules/.cache
yarn cache clean

# Créer un fichier favicon vide pour éviter l'erreur 500
echo "🔧 Création des fichiers nécessaires..."
mkdir -p public
touch public/favicon.ico

# Construire l'application
echo "🏗️ Construction de l'application..."
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" yarn build

# Démarrer avec le serveur personnalisé
echo "🚀 Démarrage du serveur personnalisé..."
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" node server-custom.js
