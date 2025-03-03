#!/bin/bash

echo "Nettoyage complet du projet..."
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json

echo "Installation des dépendances..."
npm install --legacy-peer-deps

echo "Génération des prisma client..."
npm run prisma:generate || true

echo "Construction du projet..."
npm run build || true

echo "Démarrage du serveur de développement..."
npm run dev
