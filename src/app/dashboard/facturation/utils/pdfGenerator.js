import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Fonction simple pour obtenir le label de spécialité
const getSpecialityLabel = (specialty) => {
  const specialties = {
    'general': 'Médecin Généraliste',
    'cardio': 'Cardiologue',
    'derma': 'Dermatologue',
    'nutrition': 'Nutritionniste',
    'sport': 'Médecin du Sport',
    'physio': 'Kinésithérapeute',
    // Ajoutez d'autres spécialités au besoin
  };
  return specialties[specialty] || specialty || 'Professionnel de Santé';
};

// Couleurs thème moderne
const COLORS = {
  primary: [54, 123, 240], // Bleu principal
  secondary: [63, 81, 181], // Bleu plus foncé
  accent: [255, 87, 34], // Orange accentuation
  text: [33, 33, 33], // Texte principal (presque noir)
  textLight: [117, 117, 117], // Texte secondaire (gris)
  background: [255, 255, 255], // Fond blanc
  table: {
    header: [240, 240, 240], // En-tête de tableau gris clair
    even: [255, 255, 255], // Lignes paires blanches
    odd: [249, 249, 249], // Lignes impaires gris très clair
  },
  border: [230, 230, 230], // Couleur de bordure
  success: [76, 175, 80] // Vert pour les statuts positifs
};

/**
 * Génère un PDF pour une facture donnée
 * @param {Object} invoice - L'objet facture
 * @returns {jsPDF} - Le document PDF généré
 */
export const generateInvoicePdf = (invoice) => {
  // Initialiser le document PDF
  const doc = new jsPDF();
  
  // Information par défaut du médecin (sans appel API)
  const healthProfessional = {
    name: 'Dr. Jean DUPONT',
    speciality: 'Médecin Généraliste',
    organization: 'Cabinet Médical',
    address: '42 Avenue de la Santé',
    city: 'Paris', 
    postalCode: '75001',
    country: 'France',
    phone: '01 23 45 67 89',
    email: 'contact@cabinetmedical.fr',
    siret: '123 456 789 00012'
  };
  
  // Continuer avec la génération du PDF...
  // Haut de page: logo et informations de l'entreprise
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.background);
  doc.setFontSize(22);
  doc.text('TUATHA', 20, 20);
  
  doc.setFontSize(10);
  doc.text('Facture', doc.internal.pageSize.width - 20, 15, { align: 'right' });
  doc.text(`N° ${invoice.id || 'INV-XXXX'}`, doc.internal.pageSize.width - 20, 22, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, doc.internal.pageSize.width - 20, 29, { align: 'right' });
  
  // Informations du professionnel de santé
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Émetteur:', 20, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(healthProfessional.name, 20, 62);
  doc.text(healthProfessional.speciality, 20, 68);
  doc.text(healthProfessional.organization, 20, 74);
  doc.text(healthProfessional.address, 20, 80);
  doc.text(`${healthProfessional.postalCode} ${healthProfessional.city}`, 20, 86);
  doc.text(`Tél: ${healthProfessional.phone}`, 20, 92);
  doc.text(`Email: ${healthProfessional.email}`, 20, 98);
  doc.text(`SIRET: ${healthProfessional.siret}`, 20, 104);
  
  // Informations du patient
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Destinataire:', 120, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  if (invoice.patient) {
    doc.text(invoice.patient.name || 'Nom du patient', 120, 62);
    doc.text(invoice.patient.address || 'Adresse du patient', 120, 68);
    doc.text(`${invoice.patient.postalCode || ''} ${invoice.patient.city || ''}`.trim(), 120, 74);
    doc.text(`Tél: ${invoice.patient.phone || ''}`, 120, 80);
    doc.text(`Email: ${invoice.patient.email || ''}`, 120, 86);
  } else {
    doc.text('Patient non spécifié', 120, 62);
  }
  
  // Détails de la facture
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de la facture', 20, 120);
  
  // Tableau des prestations
  const tableColumn = ['Description', 'Quantité', 'Prix unitaire', 'Total'];
  const tableRows = [];
  
  // Ajoutez ici vos prestations
  // Pour l'exemple, nous utilisons une prestation par défaut
  tableRows.push([
    invoice.description || 'Consultation',
    '1',
    `${invoice.amount} €`,
    `${invoice.amount} €`
  ]);
  
  // Ajouter le tableau au document
  autoTable(doc, {
    startY: 125,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.table.header,
      textColor: COLORS.text,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: COLORS.table.odd,
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
    },
  });
  
  // Calculer la position Y après le tableau
  const finalY = doc.lastAutoTable.finalY + 10;
  
  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ${invoice.amount} €`, doc.internal.pageSize.width - 20, finalY, { align: 'right' });
  
  // Notes
  if (invoice.notes) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textLight);
    doc.text('Notes:', 20, finalY + 20);
    doc.text(invoice.notes, 20, finalY + 28);
  }
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textLight);
  doc.text('Document généré par Tuatha - Application de gestion pour professionnels de santé', doc.internal.pageSize.width / 2, pageHeight - 10, { align: 'center' });
  
  return doc;
};

/**
 * Télécharge un PDF de facture
 * @param {Object} invoice - L'objet facture
 */
export const downloadInvoicePdf = (invoice) => {
  if (!invoice) {
    console.error('Aucune facture fournie pour le téléchargement PDF');
    return;
  }
  
  try {
    const doc = generateInvoicePdf(invoice);
    doc.save(`Facture_${invoice.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return false;
  }
};
