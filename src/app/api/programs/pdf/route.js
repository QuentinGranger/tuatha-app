import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'ID du programme à partir des paramètres de requête
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('id');

    if (!programId) {
      return NextResponse.json({ error: 'ID du programme manquant' }, { status: 400 });
    }

    // Récupérer les détails du programme depuis la base de données
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        supplements: true,
        exercises: {
          include: {
            exercise: true,
          },
        },
        healthProfessional: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    // Vérifier que l'utilisateur actuel est autorisé à accéder à ce programme
    if (program.healthProfessionalId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Non autorisé à accéder à ce programme' }, { status: 403 });
    }

    // Générer le contenu HTML du PDF
    const htmlContent = generatePdfHtml(program);
    
    // Configuration de l'en-tête de la réponse pour le téléchargement
    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="plan-nutritionnel-${program.id}.pdf"`,
    };

    // Dans un environnement réel, vous utiliseriez une bibliothèque comme jsPDF, pdf-lib ou puppeteer
    // pour générer le PDF à partir du HTML. Ici, nous renvoyons simplement le HTML pour démonstration.
    
    // Exemple de génération de PDF avec jsPDF (vous devrez implémenter cela avec la bibliothèque choisie)
    const pdfBuffer = await generatePdfFromHtml(htmlContent);
    
    return new NextResponse(pdfBuffer, { headers });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du PDF' }, { status: 500 });
  }
}

// Fonction pour générer le contenu HTML du PDF
function generatePdfHtml(program) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Plan Nutritionnel - ${program.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #FF721C;
        }
        h1 {
          color: #FF721C;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        h2 {
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .item {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #fff;
          border-left: 3px solid #FF721C;
        }
        .item-header {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .info-row {
          display: flex;
          margin-bottom: 5px;
        }
        .info-label {
          font-weight: bold;
          min-width: 150px;
        }
        .info-box {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 10px;
          background-color: #eee;
          border-radius: 3px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Plan Nutritionnel</h1>
        <h2>${program.title}</h2>
        <p>Créé le ${new Date(program.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h2>Informations générales</h2>
        <div class="info-row">
          <span class="info-label">Catégorie:</span>
          <span>${program.category || 'Non spécifié'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Objectif:</span>
          <span>${program.objective || 'Non spécifié'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Statut:</span>
          <span>${program.status || 'Non spécifié'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Description:</span>
          <span>${program.description || 'Aucune description'}</span>
        </div>
      </div>
      
      <div class="section">
        <h2>Professionnel de santé</h2>
        <div class="info-row">
          <span class="info-label">Nom:</span>
          <span>${program.healthProfessional?.user?.firstName || ''} ${program.healthProfessional?.user?.lastName || ''}</span>
        </div>
      </div>
      
      <div class="section">
        <h2>Patient</h2>
        <div class="info-row">
          <span class="info-label">Nom:</span>
          <span>${program.patient?.user?.firstName || ''} ${program.patient?.user?.lastName || ''}</span>
        </div>
      </div>
      
      ${program.exercises && program.exercises.length > 0 
        ? `<div class="section">
            <h2>Exercices</h2>
            ${program.exercises.map(pe => `
              <div class="item">
                <div class="item-header">${pe.exercise?.name || 'Exercice sans nom'}</div>
                <div class="info-row">
                  <span class="info-box">Séries: ${pe.sets || 'N/A'}</span>
                  <span class="info-box">Répétitions: ${pe.reps || 'N/A'}</span>
                  <span class="info-box">Repos: ${pe.rest || 'N/A'} sec</span>
                </div>
                <p>${pe.exercise?.description || ''}</p>
                ${pe.exercise?.muscleGroups ? `<p>Groupes musculaires: ${pe.exercise.muscleGroups.join(', ')}</p>` : ''}
              </div>
            `).join('')}
          </div>`
        : '<p>Aucun exercice spécifié</p>'
      }
      
      ${program.supplements && program.supplements.length > 0 
        ? `<div class="section">
            <h2>Suppléments</h2>
            ${program.supplements.map(supplement => `
              <div class="item">
                <div class="item-header">${supplement.name || 'Supplément sans nom'}</div>
                <div class="info-row">
                  <span class="info-box">Dosage: ${supplement.dosage || 'N/A'}</span>
                  <span class="info-box">Fréquence: ${supplement.frequency || 'N/A'}</span>
                </div>
                <p>${supplement.description || ''}</p>
              </div>
            `).join('')}
          </div>`
        : '<p>Aucun supplément spécifié</p>'
      }
      
      <div class="footer">
        <p>Ce plan nutritionnel a été généré par Tuatha - Plateforme de gestion pour professionnels de santé</p>
        <p> ${new Date().getFullYear()} Tuatha</p>
      </div>
    </body>
    </html>
  `;
}

// Cette fonction génère un PDF à partir du HTML en utilisant puppeteer
async function generatePdfFromHtml(html) {
  try {
    // Importer puppeteer dynamiquement (car il est lourd)
    const puppeteer = await import('puppeteer');
    
    // Lancer un navigateur headless
    const browser = await puppeteer.default.launch({
      headless: 'new',
    });
    
    // Créer une nouvelle page
    const page = await browser.newPage();
    
    // Définir le contenu HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    // Fermer le navigateur
    await browser.close();
    
    // Retourner le buffer PDF
    return pdfBuffer;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
}
