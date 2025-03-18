import express from 'express';
import { createServer } from 'http';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurations
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialiser Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Obtenir le chemin du dossier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Préparer Next.js
app.prepare().then(() => {
  // Créer serveur Express
  const server = express();

  // Log all requests for debugging
  server.use((req, res, next) => {
    console.log(`🔍 ${req.method} ${req.url}`);
    next();
  });

  // Servir les fichiers statiques de Next.js explicitement
  server.use('/_next/static', express.static(path.join(__dirname, '.next/static'), {
    maxAge: dev ? '0' : '365d',
    immutable: !dev
  }));

  // Servir les fichiers du dossier public
  server.use(express.static(path.join(__dirname, 'public'), {
    maxAge: dev ? '0' : '7d'
  }));

  // Gérer toutes les autres requêtes avec Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Démarrer le serveur
  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Serveur prêt sur http://${hostname}:${port}`);
  });
});
