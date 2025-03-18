#!/bin/bash

# Arrêter tous les processus Next.js en cours
echo "🛑 Arrêt des processus Next.js en cours..."
pkill -f "next" || true

# Nettoyage radical
echo "🧹 Nettoyage radical des caches et fichiers temporaires..."
rm -rf .next
rm -rf node_modules/.cache
yarn cache clean

# Créer un fichier favicon vide pour éviter l'erreur 500
echo "🔧 Création des fichiers nécessaires..."
mkdir -p public
touch public/favicon.ico

# Construire en mode production
echo "🏗️ Construction en mode production..."
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" yarn build

# Démarrer en mode production
echo "🚀 Démarrage du serveur en mode production..."
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" yarn start
