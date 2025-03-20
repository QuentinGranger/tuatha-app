import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration de base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Données démo
const demoPatients = [
  { id: 'demo1', name: 'Jean Dupont', email: 'jean.dupont@exemple.fr', age: '42', gender: 'Homme' },
  { id: 'demo2', name: 'Marie Martin', email: 'marie.martin@exemple.fr', age: '35', gender: 'Femme' },
  { id: 'demo3', name: 'Pierre Dubois', email: 'pierre.dubois@exemple.fr', age: '58', gender: 'Homme' }
];

const demoProfessionals = [
  { id: 'pro1', name: 'Dr. Sophie Legrand', email: 'sophie.legrand@exemple.fr', specialties: ['Nutritionniste', 'Diététicienne'] },
  { id: 'pro2', name: 'Dr. Thomas Petit', email: 'thomas.petit@exemple.fr', specialties: ['Préparateur physique'] },
  { id: 'pro3', name: 'Dr. Isabelle Moreau', email: 'isabelle.moreau@exemple.fr', specialties: ['Psychologue'] }
];

const demoPrograms = [
  { 
    id: 'prog1', 
    title: 'Programme Nutrition Sportive', 
    description: 'Programme adapté pour sportifs de haut niveau',
    startDate: '01/03/2024',
    endDate: '01/06/2024',
    status: 'ACTIF'
  },
  { 
    id: 'prog2', 
    title: 'Rééquilibrage Alimentaire', 
    description: 'Programme de perte de poids progressive',
    startDate: '15/02/2024',
    endDate: '15/05/2024',
    status: 'ACTIF'
  },
  { 
    id: 'prog3', 
    title: 'Renforcement Musculaire', 
    description: 'Programme de musculation adapté',
    startDate: '10/01/2024',
    endDate: '10/04/2024',
    status: 'TERMINÉ'
  }
];

const demoInvoices = [
  { 
    id: 'inv1', 
    patientName: 'Jean Dupont',
    professionalName: 'Dr. Sophie Legrand',
    amount: 75.00,
    date: '15/03/2024',
    status: 'PAYÉ',
    reference: 'FACT-2024-001'
  },
  { 
    id: 'inv2', 
    patientName: 'Marie Martin',
    professionalName: 'Dr. Thomas Petit',
    amount: 120.00,
    date: '18/03/2024',
    status: 'EN ATTENTE',
    reference: 'FACT-2024-002'
  },
  { 
    id: 'inv3', 
    patientName: 'Pierre Dubois',
    professionalName: 'Dr. Isabelle Moreau',
    amount: 90.00,
    date: '20/03/2024',
    status: 'EN ATTENTE',
    reference: 'FACT-2024-003'
  }
];

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
                <a href="/api/billing">/api/billing</a> - Facturation
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
app.get('/api/patients', (req, res) => {
  res.json(demoPatients);
});

// Route professionnels
app.get('/api/professionals', (req, res) => {
  res.json(demoProfessionals);
});

// Route programmes
app.get('/api/programs', (req, res) => {
  res.json(demoPrograms);
});

// Route facturation
app.get('/api/billing', (req, res) => {
  res.json(demoInvoices);
});

// Routes ajout de PDF
app.get('/api/programs/pdf', (req, res) => {
  const programId = req.query.id || 'prog1';
  const program = demoPrograms.find(p => p.id === programId) || demoPrograms[0];
  
  res.json({
    message: "Génération PDF simulée pour la démo",
    program: program,
    pdfUrl: `/demo-assets/programme_${programId}.pdf`
  });
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
