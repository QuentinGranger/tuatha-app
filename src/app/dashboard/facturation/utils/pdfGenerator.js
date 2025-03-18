import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSpecialityLabel } from '../../../../services/userService';

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
  
  // Fetch directement l'utilisateur connecté (pour éviter les problèmes de synchronisation)
  fetch('/api/health-professional/current')
    .then(response => response.json())
    .then(data => {
      console.log('Current user data:', data);
      
      // Information du médecin
      const healthProfessional = {
        name: data?.user ? `${data.user.firstName} ${data.user.lastName}` : 'Dr. Jean DUPONT',
        speciality: data?.specialty ? getSpecialityLabel(data.specialty) : 'Médecin Généraliste',
        organization: data?.organization || 'Cabinet Médical',
        address: '42 Avenue de la Santé',
        city: 'Paris', 
        postalCode: '75001',
        country: 'France',
        phone: data?.user?.phoneNumber || '01 23 45 67 89',
        email: data?.user?.email || 'contact@cabinetmedical.fr',
        siret: '123 456 789 00012'
      };
      
      console.log('HealthProfessional info:', healthProfessional);
      
      // Continuer avec la génération du PDF...
      continueGeneratePdf(doc, invoice, healthProfessional);
    })
    .catch(error => {
      console.error('Error fetching health professional:', error);
      
      // En cas d'erreur, utiliser des données par défaut
      const healthProfessional = {
        name: 'Dr. Jean DUPONT',
        speciality: 'Médecin Généraliste',
        address: '42 Avenue de la Santé',
        city: 'Paris', 
        postalCode: '75001',
        country: 'France',
        phone: '01 23 45 67 89',
        email: 'contact@cabinetmedical.fr',
        siret: '123 456 789 00012'
      };
      
      // Continuer avec la génération du PDF...
      continueGeneratePdf(doc, invoice, healthProfessional);
    });
  
  return doc;
};

/**
 * Poursuit la génération du PDF avec les informations du professionnel de santé
 * @param {jsPDF} doc - Le document PDF
 * @param {Object} invoice - La facture
 * @param {Object} healthProfessional - Les informations du professionnel de santé
 */
const continueGeneratePdf = (doc, invoice, healthProfessional) => {
  console.log('Données de facture reçues:', invoice);

  // Fond blanc simple (supprimer l'effet marron)
  doc.setFillColor(...COLORS.background);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Ligne de séparation supérieure
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(10, 10, doc.internal.pageSize.width - 10, 10);
  
  // En-tête - Nom du cabinet/de la spécialité
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.primary);
  doc.text(healthProfessional.speciality || 'Cabinet Médical', 15, 20);
  
  // Informations de l'émetteur
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.text([
    healthProfessional.name,
    `${healthProfessional.address || ''}`,
    `${healthProfessional.postalCode || ''} ${healthProfessional.city || ''}, ${healthProfessional.country || ''}`,
    `Tél: ${healthProfessional.phone || ''}`,
    `Email: ${healthProfessional.email || ''}`,
    `SIRET: ${healthProfessional.siret || ''}`
  ], 15, 25);
  
  // Bloc FACTURE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.accent);
  doc.text('FACTURE', doc.internal.pageSize.width - 15, 20, { align: 'right' });
  
  // Numéro de facture et date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text([
    `N°: ${invoice.invoiceNumber || invoice.id || 'N/A'}`,
    `Date: ${formatDate(invoice.date) || 'N/A'}`,
    `Échéance: ${formatDate(invoice.dueDate) || 'N/A'}`
  ], doc.internal.pageSize.width - 15, 30, { align: 'right' });
  
  // Ligne de séparation pour la section PATIENT
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(15, 60, doc.internal.pageSize.width - 15, 60);
  
  // Informations du patient
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text('PATIENT', 15, 70);
  
  // Récupération des données du patient avec gestion des valeurs manquantes
  const patient = invoice.patient || {};
  const patientName = patient.firstName && patient.lastName ? 
                     `${patient.firstName} ${patient.lastName}` : 
                     (patient.name || 'Patient non spécifié');
  
  // Affiche les informations complètes du patient pour debug
  console.log('Données du patient reçues:', patient);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text([
    patientName,
    patient.address || '',
    `${patient.postalCode || ''} ${patient.city || ''}`,
    `Date de naissance: ${formatDate(patient.birthDate) || 'N/A'}`,
    `Tél: ${patient.phone || patient.phoneNumber || ''}`,
    `Email: ${patient.email || ''}`,
    `N° Sécurité Sociale: ${patient.socialSecurity || patient.socialSecurityNumber || ''}`
  ], 15, 80);
  
  // Tableau des prestations
  const tableColumn = ['Prestation', 'Date', 'Prix unitaire', 'Quantité', 'Total'];
  const tableRows = [];
  
  // Calculer le total
  let total = 0;
  
  // Récupération des items avec vérification
  const items = Array.isArray(invoice.items) && invoice.items.length > 0 ? 
                invoice.items : [
    { 
      description: 'Consultation standard', 
      date: new Date().toISOString().split('T')[0], 
      unitPrice: 25, 
      quantity: 1 
    }
  ];
  
  // Debug des items
  console.log('Items de facture à traiter:', items);
  
  // Ajout des prestations dans le tableau avec vérification des données
  for (const item of items) {
    // Debug de chaque item
    console.log('Traitement item:', item);
    
    // Récupérer les prix selon les différentes structures possibles
    const itemUnitPrice = parseFloat(item.unitPrice || item.price || item.amount || 0);
    const itemQuantity = parseInt(item.quantity || 1);
    const itemTotal = itemUnitPrice * itemQuantity;
    
    console.log(`Prix unitaire: ${itemUnitPrice}, Quantité: ${itemQuantity}, Total: ${itemTotal}`);
    
    total += itemTotal;
    
    tableRows.push([
      item.description || item.name || 'Service',
      formatDate(item.date || item.serviceDate),
      formatCurrency(itemUnitPrice),
      itemQuantity.toString(),
      formatCurrency(itemTotal)
    ]);
  }
  
  // Ajouter le tableau au document avec un design épuré
  autoTable(doc, {
    startY: 120,
    head: [tableColumn],
    body: tableRows,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: [...COLORS.text],
      lineColor: [...COLORS.border],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [...COLORS.table.header],
      textColor: [...COLORS.text],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [...COLORS.table.odd],
    },
    bodyStyles: {
      fillColor: [...COLORS.table.even],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { top: 120 }
  });
  
  // Position fixe pour le récapitulatif des prix
  const finalY = 220;
  
  // Sommaire des prix avec un design moderne
  doc.setFillColor(...COLORS.table.odd);
  doc.rect(doc.internal.pageSize.width - 100, finalY, 85, 40, 'F');
  
  // Ajout d'une bordure fine
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.rect(doc.internal.pageSize.width - 100, finalY, 85, 40, 'S');
  
  // Résumé des coûts
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.text([
    `Sous-total:`,
    `TVA (0%):`,
    `Réduction:`
  ], doc.internal.pageSize.width - 95, finalY + 10);
  
  // Valeurs alignées à droite
  doc.text([
    formatCurrency(total),
    formatCurrency(0),
    formatCurrency(0)
  ], doc.internal.pageSize.width - 20, finalY + 10, { align: 'right' });
  
  // Trait horizontal de séparation
  doc.setDrawColor(...COLORS.border);
  doc.line(doc.internal.pageSize.width - 100, finalY + 25, doc.internal.pageSize.width - 15, finalY + 25);
  
  // Total à payer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.accent);
  doc.text('Total à payer:', doc.internal.pageSize.width - 95, finalY + 35);
  doc.text(formatCurrency(total), doc.internal.pageSize.width - 20, finalY + 35, { align: 'right' });
  
  // Ligne de séparation avant le footer
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(15, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 30);
  
  // Texte du footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textLight);
  doc.text(
    `Cette facture a été générée grâce à Tuatha. Pour toute information, veuillez contacter votre médecin traitant ${healthProfessional.name} au ${healthProfessional.phone}`,
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 20,
    { align: 'center', maxWidth: doc.internal.pageSize.width - 40 }
  );
  
  // Numéro de page
  doc.text(
    `Page 1/1`,
    doc.internal.pageSize.width - 15,
    doc.internal.pageSize.height - 10,
    { align: 'right' }
  );
  
  doc.save(`facture_${invoice.invoiceNumber || invoice.id || 'sans_numero'}.pdf`);
};

/**
 * Formate une date pour l'affichage
 * @param {string} dateString - La date à formater
 * @returns {string} - La date formatée
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'N/A';
  }
};

/**
 * Formate un montant pour l'affichage
 * @param {number} amount - Le montant à formater
 * @returns {string} - Le montant formaté
 */
export const formatCurrency = (amount) => {
  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '0,00 €';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(parsedAmount);
  } catch (error) {
    console.error('Erreur de formatage de montant:', error);
    return '0,00 €';
  }
};

/**
 * Télécharge une facture au format PDF
 * @param {Object} invoice - L'objet facture
 */
export const downloadInvoicePdf = (invoice) => {
  // Affiche les données complètes de la facture pour debug
  console.log('Données complètes de la facture à télécharger:', JSON.stringify(invoice, null, 2));
  
  // Récupérer les données du professionnel de santé directement
  fetch('/api/health-professional/current')
    .then(response => response.json())
    .then(data => {
      console.log('Current user data pour téléchargement:', data);
      
      // Information du médecin
      const healthProfessional = {
        name: data?.user ? `${data.user.firstName} ${data.user.lastName}` : 'Dr. Jean DUPONT',
        speciality: data?.specialty ? getSpecialityLabel(data.specialty) : 'Médecin Généraliste',
        organization: data?.organization || 'Cabinet Médical',
        address: '42 Avenue de la Santé',
        city: 'Paris', 
        postalCode: '75001',
        country: 'France',
        phone: data?.user?.phoneNumber || '01 23 45 67 89',
        email: data?.user?.email || 'contact@cabinetmedical.fr',
        siret: '123 456 789 00012'
      };
      
      console.log('HealthProfessional pour téléchargement:', healthProfessional);
      
      // Créer le PDF et le télécharger
      const doc = new jsPDF();
      continueGeneratePdf(doc, invoice, healthProfessional);
    })
    .catch(error => {
      console.error('Error fetching health professional:', error);
      
      // En cas d'erreur, utiliser des données par défaut
      const healthProfessional = {
        name: 'Dr. Jean DUPONT',
        speciality: 'Médecin Généraliste',
        address: '42 Avenue de la Santé',
        city: 'Paris', 
        postalCode: '75001',
        country: 'France',
        phone: '01 23 45 67 89',
        email: 'contact@cabinetmedical.fr',
        siret: '123 456 789 00012'
      };
      
      // Créer le PDF et le télécharger
      const doc = new jsPDF();
      continueGeneratePdf(doc, invoice, healthProfessional);
    });
};
