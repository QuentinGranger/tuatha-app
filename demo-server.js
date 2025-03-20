import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuration de base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const prisma = new PrismaClient();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir les fichiers statiques de l'application
app.use(express.static('public'));

// Définir la page d'accueil en HTML pour la démo
const homePage = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tuatha - Démo</title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #f5f5f5;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #FF8800;
        }
        .main-content {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        .card h2 {
            margin-top: 0;
            color: #FF8800;
            font-size: 20px;
        }
        .button {
            background: linear-gradient(135deg, #FF8800 0%, #FFB366 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
            text-decoration: none;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(255, 136, 0, 0.2);
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            margin: 15px 0;
            background: linear-gradient(135deg, #FF8800 0%, #FFB366 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .api-list {
            margin-top: 20px;
        }
        .api-list a {
            display: block;
            color: #FF8800;
            text-decoration: none;
            margin-bottom: 8px;
            transition: color 0.3s ease;
        }
        .api-list a:hover {
            color: #FFB366;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">TUATHA</div>
            <button class="button">Espace Administration</button>
        </header>

        <div class="main-content">
            <div class="card">
                <h2>Dashboard Patients</h2>
                <p>Accédez à la liste complète des patients et leurs dossiers.</p>
                <div class="stat-number">128</div>
                <p>Patients enregistrés</p>
                <a href="/api/patients" class="button">Consulter</a>
            </div>

            <div class="card">
                <h2>Professionnels de Santé</h2>
                <p>Gérez les professionnels et leurs spécialités.</p>
                <div class="stat-number">42</div>
                <p>Professionnels actifs</p>
                <a href="/api/professionals" class="button">Consulter</a>
            </div>

            <div class="card">
                <h2>Programmes Nutritionnels</h2>
                <p>Créez et suivez les programmes nutritionnels personnalisés.</p>
                <div class="stat-number">95</div>
                <p>Programmes actifs</p>
                <a href="/api/programs" class="button">Consulter</a>
            </div>

            <div class="card">
                <h2>Facturation</h2>
                <p>Gérez les factures et les paiements des patients.</p>
                <div class="stat-number">215</div>
                <p>Factures générées</p>
                <a href="/api/billing" class="button">Consulter</a>
            </div>
        </div>

        <div class="card">
            <h2>API Disponibles pour la démo</h2>
            <p>Points d'API fonctionnels pour la démonstration:</p>
            <div class="api-list">
                <a href="/api/health">/api/health</a> - Statut du serveur
                <a href="/api/patients">/api/patients</a> - Liste des patients
                <a href="/api/professionals">/api/professionals</a> - Liste des professionnels
                <a href="/api/programs">/api/programs</a> - Liste des programmes
            </div>
        </div>
    </div>
</body>
</html>
`;

// Routes API

// Route racine - Page d'accueil
app.get('/', (req, res) => {
  res.send(homePage);
});

// Route santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Route patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Si pas de données, retourner des données simulées
    if (patients.length === 0) {
      return res.json([
        { id: 'demo1', user: { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@exemple.fr' }, age: '42', gender: 'Homme' },
        { id: 'demo2', user: { firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@exemple.fr' }, age: '35', gender: 'Femme' },
        { id: 'demo3', user: { firstName: 'Pierre', lastName: 'Dubois', email: 'pierre.dubois@exemple.fr' }, age: '58', gender: 'Homme' }
      ]);
    }
    
    res.json(patients);
  } catch (error) {
    console.error('Erreur récupération patients:', error);
    res.status(500).json({ 
      error: 'Erreur récupération patients',
      message: error.message 
    });
  }
});

// Route professionnels
app.get('/api/professionals', async (req, res) => {
  try {
    const professionals = await prisma.healthProfessional.findMany({
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Si pas de données, retourner des données simulées
    if (professionals.length === 0) {
      return res.json([
        { id: 'pro1', user: { firstName: 'Dr. Sophie', lastName: 'Legrand', email: 'sophie.legrand@exemple.fr' }, specialtyList: ['NUTRITIONIST', 'DIETITIAN'] },
        { id: 'pro2', user: { firstName: 'Dr. Thomas', lastName: 'Petit', email: 'thomas.petit@exemple.fr' }, specialtyList: ['PHYSICAL_TRAINER'] },
        { id: 'pro3', user: { firstName: 'Dr. Isabelle', lastName: 'Moreau', email: 'isabelle.moreau@exemple.fr' }, specialtyList: ['PSYCHOLOGIST'] }
      ]);
    }
    
    res.json(professionals);
  } catch (error) {
    console.error('Erreur récupération professionnels:', error);
    res.status(500).json({ 
      error: 'Erreur récupération professionnels',
      message: error.message 
    });
  }
});

// Route programmes
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      take: 10,
      include: {
        healthProfessional: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    // Si pas de données, retourner des données simulées
    if (programs.length === 0) {
      return res.json([
        { 
          id: 'prog1', 
          title: 'Programme Nutrition Sportive', 
          description: 'Programme adapté pour sportifs de haut niveau',
          startDate: new Date(2024, 2, 1),
          endDate: new Date(2024, 5, 1),
          status: 'ACTIVE'
        },
        { 
          id: 'prog2', 
          title: 'Rééquilibrage Alimentaire', 
          description: 'Programme de perte de poids progressive',
          startDate: new Date(2024, 1, 15),
          endDate: new Date(2024, 4, 15),
          status: 'ACTIVE'
        },
        { 
          id: 'prog3', 
          title: 'Renforcement Musculaire', 
          description: 'Programme de musculation adapté',
          startDate: new Date(2024, 0, 10),
          endDate: new Date(2024, 3, 10),
          status: 'COMPLETED'
        }
      ]);
    }
    
    res.json(programs);
  } catch (error) {
    console.error('Erreur récupération programmes:', error);
    res.status(500).json({ 
      error: 'Erreur récupération programmes',
      message: error.message 
    });
  }
});

// Route facturation (simulée pour la démo)
app.get('/api/billing', (req, res) => {
  const demoInvoices = [
    { 
      id: 'inv1', 
      patientName: 'Jean Dupont',
      professionalName: 'Dr. Sophie Legrand',
      amount: 75.00,
      date: new Date(2024, 2, 15),
      status: 'PAID',
      reference: 'FACT-2024-001'
    },
    { 
      id: 'inv2', 
      patientName: 'Marie Martin',
      professionalName: 'Dr. Thomas Petit',
      amount: 120.00,
      date: new Date(2024, 2, 18),
      status: 'PENDING',
      reference: 'FACT-2024-002'
    },
    { 
      id: 'inv3', 
      patientName: 'Pierre Dubois',
      professionalName: 'Dr. Isabelle Moreau',
      amount: 90.00,
      date: new Date(2024, 2, 20),
      status: 'PENDING',
      reference: 'FACT-2024-003'
    }
  ];
  
  res.json(demoInvoices);
});

// Gestion des routes non trouvées
app.get('*', (req, res) => {
  res.redirect('/');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur de démo Tuatha démarré sur http://localhost:${port}`);
  console.log('Pour arrêter: Ctrl+C');
});
