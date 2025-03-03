'use client';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import dynamique des composants PDF avec SSR désactivé
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), {
  ssr: false,
  loading: () => <div>Chargement de la prévisualisation...</div>
});

const ReactPDF = dynamic(() => import('@react-pdf/renderer'), {
  ssr: false
});

// Configuration des styles pour jsPDF
const STYLES = {
  fonts: {
    normal: 12,
    small: 10,
    large: 14,
    title: 18
  },
  colors: {
    primary: [255, 114, 28], // #FF721C
    text: [51, 51, 51], // #333333
    lightText: [119, 119, 119] // #777777
  },
  spacing: {
    margin: 30,
    padding: 10
  }
};

const formatDate = (date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr });

const drawHeader = (doc, program) => {
  const pageWidth = doc.internal.pageSize.width;
  const columnWidth = (pageWidth - (STYLES.spacing.margin * 3)) / 2;
  let yPos = STYLES.spacing.margin;

  // Titre centré
  doc.setFontSize(STYLES.fonts.title);
  doc.setTextColor(...STYLES.colors.primary);
  doc.text(program.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += STYLES.spacing.margin;

  // Colonne gauche - Patient
  doc.setFontSize(STYLES.fonts.normal);
  doc.text('Patient', STYLES.spacing.margin, yPos);
  yPos += STYLES.spacing.padding;

  const patient = program.patient;
  const patientUser = patient.user;
  
  doc.setFontSize(STYLES.fonts.normal);
  doc.setTextColor(...STYLES.colors.text);
  doc.text([
    `${patientUser.firstName} ${patientUser.lastName}`,
    `Sport pratiqué: ${patient.sport || 'Non renseigné'}`,
    patient.injury ? `Blessure: ${patient.injury}` : '',
    `Status nutritionnel: ${patient.nutritionalStatus || 'Non renseigné'}`,
    patient.allergies ? `Allergies: ${patient.allergies}` : '',
    patient.intolerances ? `Intolérances: ${patient.intolerances}` : '',
  ].filter(Boolean), STYLES.spacing.margin, yPos);

  // Colonne droite - Professionnel de santé
  yPos = STYLES.spacing.margin + STYLES.spacing.margin;
  doc.setFontSize(STYLES.fonts.normal);
  doc.text('Professionnel de santé', pageWidth - columnWidth - STYLES.spacing.margin, yPos);
  yPos += STYLES.spacing.padding;

  const healthPro = program.healthProfessional;
  const healthProUser = healthPro.user;
  
  doc.setFontSize(STYLES.fonts.normal);
  doc.setTextColor(...STYLES.colors.text);
  const healthProInfo = [
    `${healthProUser.firstName} ${healthProUser.lastName}`,
    `${healthPro.specialty}${healthPro.subSpecialty ? ` - ${healthPro.subSpecialty}` : ''}`,
    `Cabinet: ${healthPro.street}`,
    `${healthPro.postalCode} ${healthPro.city}`,
    `Tél: ${healthProUser.phoneNumber || 'Non renseigné'}`,
    `Email: ${healthProUser.email}`,
    healthPro.rppsNumber ? `N° RPPS: ${healthPro.rppsNumber}` : '',
    healthPro.adeliNumber ? `N° ADELI: ${healthPro.adeliNumber}` : ''
  ].filter(Boolean);

  doc.text(healthProInfo, pageWidth - columnWidth - STYLES.spacing.margin, yPos, { align: 'right' });
  
  yPos += Math.max(healthProInfo.length * STYLES.spacing.padding, STYLES.spacing.margin * 2);
  return yPos;
};

const drawSectionTitle = (doc, title, yPos) => {
  doc.setFontSize(STYLES.fonts.large);
  doc.setTextColor(...STYLES.colors.primary);
  doc.text(title, STYLES.spacing.margin, yPos);
  return yPos + STYLES.spacing.padding;
};

const drawDivider = (doc, yPos) => {
  doc.setDrawColor(...STYLES.colors.lightText);
  doc.setLineWidth(0.5);
  doc.line(STYLES.spacing.margin, yPos, doc.internal.pageSize.width - STYLES.spacing.margin, yPos);
  return yPos + STYLES.spacing.padding;
};

const checkPageBreak = (doc, yPos, requiredSpace = 100) => {
  if (yPos > doc.internal.pageSize.height - requiredSpace) {
    doc.addPage();
    return STYLES.spacing.margin;
  }
  return yPos;
};

const drawFooter = (doc, pageNumber, totalPages, healthPro) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const footerHeight = 65; 
  const footerY = pageHeight - footerHeight;

  // Fond du footer
  doc.setFillColor(250, 250, 250);
  doc.rect(0, footerY, pageWidth, footerHeight, 'F');

  // Ligne de séparation
  doc.setDrawColor(...STYLES.colors.primary);
  doc.setLineWidth(0.5);
  doc.line(STYLES.spacing.margin, footerY + 2, pageWidth - STYLES.spacing.margin, footerY + 2);

  // Footer content
  doc.setFontSize(STYLES.fonts.small);

  // Logo et nom de l'entreprise (gauche)
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...STYLES.colors.primary);
  doc.text('TUATHA', STYLES.spacing.margin, footerY + 20);
  
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...STYLES.colors.text);
  doc.text('Votre partenaire santé et performance', STYLES.spacing.margin, footerY + 35);

  // Contact du praticien (centre)
  const healthProUser = healthPro.user;
  doc.text([
    `${healthProUser.firstName} ${healthProUser.lastName}`,
    healthProUser.email
  ], pageWidth / 2, footerY + 20, { align: 'center' });
  
  if (healthProUser.phoneNumber) {
    doc.text(healthProUser.phoneNumber, pageWidth / 2, footerY + 35, { align: 'center' });
  }

  // Date et numéro de page (droite)
  const generationDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr });
  doc.text(
    `Généré le ${generationDate}`,
    pageWidth - STYLES.spacing.margin,
    footerY + 20,
    { align: 'right' }
  );
  doc.text(
    `Page ${pageNumber} sur ${totalPages}`,
    pageWidth - STYLES.spacing.margin,
    footerY + 35,
    { align: 'right' }
  );
};

const calculateNutritionTotals = (mealTimes) => {
  return mealTimes.reduce((totals, meal) => {
    const food = meal.food;
    totals.calories += food.calories || 0;
    totals.proteins += food.proteins || 0;
    totals.carbs += food.carbs || 0;
    totals.fats += food.fats || 0;
    return totals;
  }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });
};

export const generatePDF = async (program) => {
  const doc = new jsPDF({ format: 'letter' });
  let yPos = drawHeader(doc, program);
  
  // Détails du programme
  yPos = drawSectionTitle(doc, 'Détails du programme', yPos);
  doc.setFontSize(STYLES.fonts.normal);
  doc.setTextColor(...STYLES.colors.text);

  doc.text([
    `Date de début: ${formatDate(program.startDate)}`,
    program.endDate ? `Date de fin: ${formatDate(program.endDate)}` : '',
    `Status: ${program.status}`,
    program.description ? `Description: ${program.description}` : ''
  ].filter(Boolean), STYLES.spacing.margin + 10, yPos);
  
  yPos += STYLES.spacing.margin;
  yPos = drawDivider(doc, yPos);

  // Plan alimentaire
  if (program.mealTimes && program.mealTimes.length > 0) {
    yPos = checkPageBreak(doc, yPos);
    yPos = drawSectionTitle(doc, 'Plan alimentaire', yPos);

    // Résumé nutritionnel
    const nutritionTotals = calculateNutritionTotals(program.mealTimes);
    
    doc.autoTable({
      startY: yPos,
      head: [['Total journalier', 'Calories', 'Protéines', 'Glucides', 'Lipides']],
      body: [[
        'Valeurs',
        `${Math.round(nutritionTotals.calories)} kcal`,
        `${Math.round(nutritionTotals.proteins)}g`,
        `${Math.round(nutritionTotals.carbs)}g`,
        `${Math.round(nutritionTotals.fats)}g`
      ]],
      theme: 'grid',
      headStyles: { fillColor: STYLES.colors.primary },
      styles: { fontSize: STYLES.fonts.small, halign: 'center' }
    });

    yPos = doc.lastAutoTable.finalY + STYLES.spacing.padding;

    // Répartition par repas
    const mealsByTime = program.mealTimes.reduce((acc, meal) => {
      if (!acc[meal.timeOfDay]) acc[meal.timeOfDay] = [];
      acc[meal.timeOfDay].push(meal);
      return acc;
    }, {});

    for (const [timeOfDay, meals] of Object.entries(mealsByTime)) {
      yPos = checkPageBreak(doc, yPos, 50);
      doc.setFontSize(STYLES.fonts.normal);
      doc.setTextColor(...STYLES.colors.primary);
      doc.text(`${timeOfDay}:`, STYLES.spacing.margin + 10, yPos);
      yPos += STYLES.spacing.padding;

      doc.setFontSize(STYLES.fonts.small);
      doc.setTextColor(...STYLES.colors.text);
      
      const tableData = meals.map(meal => {
        const food = meal.food;
        return [
          food.name,
          `${food.calories} kcal`,
          `${food.proteins}g`,
          `${food.carbs}g`,
          `${food.fats}g`,
          meal.quantity ? `${meal.quantity}${meal.unit || 'g'}` : '-',
          meal.notes || '-'
        ];
      });

      doc.autoTable({
        startY: yPos,
        head: [['Aliment', 'Calories', 'Protéines', 'Glucides', 'Lipides', 'Quantité', 'Notes']],
        body: tableData,
        margin: { left: STYLES.spacing.margin + 20 },
        theme: 'grid',
        headStyles: { fillColor: STYLES.colors.primary },
        styles: { fontSize: STYLES.fonts.small },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 'auto' }
        }
      });

      yPos = doc.lastAutoTable.finalY + STYLES.spacing.padding;
    }
    yPos += STYLES.spacing.margin - STYLES.spacing.padding;
    yPos = drawDivider(doc, yPos);
  }

  // Suppléments
  if (program.supplements && program.supplements.length > 0) {
    yPos = checkPageBreak(doc, yPos);
    yPos = drawSectionTitle(doc, 'Suppléments', yPos);

    const tableData = program.supplements.map(supplement => [
      supplement.name,
      supplement.type,
      supplement.dosage || 'Non spécifié',
      supplement.frequency || 'Non spécifiée',
      supplement.timing || 'Non spécifié',
      supplement.notes || '-'
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Nom', 'Type', 'Dosage', 'Fréquence', 'Moment', 'Notes']],
      body: tableData,
      margin: { left: STYLES.spacing.margin },
      theme: 'grid',
      headStyles: { fillColor: STYLES.colors.primary },
      styles: { fontSize: STYLES.fonts.small }
    });

    yPos = doc.lastAutoTable.finalY + STYLES.spacing.margin;
    yPos = drawDivider(doc, yPos);
  }

  // Exercices
  if (program.exercises && program.exercises.length > 0) {
    yPos = checkPageBreak(doc, yPos);
    yPos = drawSectionTitle(doc, 'Programme d\'exercices', yPos);

    program.exercises.forEach(programExercise => {
      yPos = checkPageBreak(doc, yPos, 60);
      const exercise = programExercise.exercise;
      
      doc.setFontSize(STYLES.fonts.normal);
      doc.setTextColor(...STYLES.colors.primary);
      doc.text(exercise.name, STYLES.spacing.margin + 10, yPos);
      yPos += STYLES.spacing.padding;

      doc.setFontSize(STYLES.fonts.small);
      doc.setTextColor(...STYLES.colors.text);
      doc.text([
        `Séries: ${programExercise.sets || '-'} | Répétitions: ${programExercise.reps || '-'} | Durée: ${programExercise.duration ? programExercise.duration + ' min' : '-'}`,
        `Groupes musculaires: ${exercise.muscleGroups.join(', ')}`,
        `Équipement nécessaire: ${exercise.equipment.join(', ')}`,
        programExercise.notes ? `Notes: ${programExercise.notes}` : '',
        exercise.description ? `Description: ${exercise.description}` : '',
        exercise.precautions ? `Précautions: ${exercise.precautions}` : ''
      ].filter(Boolean), STYLES.spacing.margin + 20, yPos);
      
      yPos += STYLES.spacing.margin;
    });
  }

  // Ajout du footer sur chaque page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages, program.healthProfessional);
  }

  // Sauvegarde du PDF
  const fileName = `Programme_${program.title.replace(/\s+/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
  doc.save(fileName);
};

// Composant de preview React-PDF
export const ProgramPreview = ({ program }) => {
  const [pdfComponents, setPdfComponents] = useState(null);
  const [styles, setStyles] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const reactPdf = await import('@react-pdf/renderer');
        const { Document, Page, Text, View, StyleSheet } = reactPdf;
        
        setPdfComponents({ Document, Page, Text, View });
        
        // Création des styles une fois que nous avons StyleSheet
        setStyles(StyleSheet.create({
          page: {
            padding: 30,
            fontSize: 12,
            fontFamily: 'Helvetica'
          },
          title: {
            fontSize: 18,
            marginBottom: 20,
            color: '#FF721C',
            textAlign: 'center'
          },
          header: {
            flexDirection: 'row',
            marginBottom: 30,
          },
          leftColumn: {
            width: '50%',
            paddingRight: 15,
          },
          rightColumn: {
            width: '50%',
            paddingLeft: 15,
          },
          section: {
            marginBottom: 20,
          },
          sectionTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#333333',
          },
          text: {
            marginBottom: 5,
            color: '#333333',
          },
          footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: '#fafafa',
            borderTop: '1px solid #FF721C',
            padding: '10px 30px',
          },
          footerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: '100%',
          },
          footerColumn: {
            width: '33%',
            justifyContent: 'center',
          },
          footerLeft: {
            alignItems: 'flex-start',
          },
          footerCenter: {
            alignItems: 'center',
          },
          footerRight: {
            alignItems: 'flex-end',
          },
          footerTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          footerText: {
            fontSize: 10,
            marginBottom: 3,
          },
          table: {
            border: '1px solid #ddd',
            width: '100%',
          },
          tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#f0f0f0',
            padding: 5,
          },
          tableCell: {
            padding: 5,
            borderRight: '1px solid #ddd',
          },
          tableCellHeader: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tableRow: {
            flexDirection: 'row',
            padding: 5,
          },
          tableRowEven: {
            backgroundColor: '#f9f9f9',
          },
          tableRowOdd: {
            backgroundColor: '#fff',
          },
          tableCellText: {
            fontSize: 12,
          }
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des composants PDF:', error);
      }
    };

    loadComponents();
  }, []);

  // Vérification qu'on est côté client et que les composants sont chargés
  if (typeof window === 'undefined' || !pdfComponents || !styles) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la prévisualisation...</p>
        </div>
      </div>
    );
  }

  const { Document, Page, Text, View } = pdfComponents;
  const healthPro = program.healthProfessional;
  const healthProUser = healthPro.user;
  const generationDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr });

  return (
    <PDFViewer style={{ width: '100%', height: '80vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>{program.title}</Text>
          
          <View style={styles.header}>
            <View style={styles.leftColumn}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Patient</Text>
                <Text style={styles.text}>{program.patient.user.firstName} {program.patient.user.lastName}</Text>
                {program.patient.sport && (
                  <Text style={styles.text}>Sport : {program.patient.sport}</Text>
                )}
                {program.patient.injury && (
                  <Text style={styles.text}>Blessure : {program.patient.injury}</Text>
                )}
                {program.patient.nutritionalStatus && (
                  <Text style={styles.text}>Status nutritionnel : {program.patient.nutritionalStatus}</Text>
                )}
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professionnel de santé</Text>
                <Text style={styles.text}>{program.healthProfessional.user.firstName} {program.healthProfessional.user.lastName}</Text>
                <Text style={styles.text}>{program.healthProfessional.specialty}</Text>
                <Text style={styles.text}>{program.healthProfessional.street}</Text>
                <Text style={styles.text}>{program.healthProfessional.postalCode} {program.healthProfessional.city}</Text>
              </View>
            </View>
          </View>

          {/* Détails du programme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détails du programme</Text>
            <Text style={styles.text}>Date de début : {formatDate(program.startDate)}</Text>
            {program.endDate && (
              <Text style={styles.text}>Date de fin : {formatDate(program.endDate)}</Text>
            )}
            <Text style={styles.text}>Status : {program.status}</Text>
            {program.description && (
              <Text style={styles.text}>{program.description}</Text>
            )}
          </View>

          {/* Tableau des compléments */}
          {program.supplements && program.supplements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compléments alimentaires</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={[styles.tableCell, { width: '20%' }]}>
                    <Text style={styles.tableCellHeader}>Nom</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '15%' }]}>
                    <Text style={styles.tableCellHeader}>Type</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '15%' }]}>
                    <Text style={styles.tableCellHeader}>Dosage</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '15%' }]}>
                    <Text style={styles.tableCellHeader}>Fréquence</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '15%' }]}>
                    <Text style={styles.tableCellHeader}>Moment</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '20%' }]}>
                    <Text style={styles.tableCellHeader}>Notes</Text>
                  </View>
                </View>
                {program.supplements.map((supplement, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                    <View style={[styles.tableCell, { width: '20%' }]}>
                      <Text style={styles.tableCellText}>{supplement.name}</Text>
                    </View>
                    <View style={[styles.tableCell, { width: '15%' }]}>
                      <Text style={styles.tableCellText}>{supplement.type}</Text>
                    </View>
                    <View style={[styles.tableCell, { width: '15%' }]}>
                      <Text style={styles.tableCellText}>{supplement.dosage || '-'}</Text>
                    </View>
                    <View style={[styles.tableCell, { width: '15%' }]}>
                      <Text style={styles.tableCellText}>{supplement.frequency || '-'}</Text>
                    </View>
                    <View style={[styles.tableCell, { width: '15%' }]}>
                      <Text style={styles.tableCellText}>{supplement.timing || '-'}</Text>
                    </View>
                    <View style={[styles.tableCell, { width: '20%' }]}>
                      <Text style={styles.tableCellText}>{supplement.notes || '-'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <View style={[styles.footerColumn, styles.footerLeft]}>
                <Text style={styles.footerTitle}>TUATHA</Text>
                <Text style={styles.footerText}>Votre partenaire santé et performance</Text>
              </View>
              <View style={[styles.footerColumn, styles.footerCenter]}>
                <Text style={styles.footerText}>{healthProUser.firstName} {healthProUser.lastName}</Text>
                <Text style={styles.footerText}>{healthProUser.email}</Text>
                {healthProUser.phoneNumber && (
                  <Text style={styles.footerText}>{healthProUser.phoneNumber}</Text>
                )}
              </View>
              <View style={[styles.footerColumn, styles.footerRight]}>
                <Text style={styles.footerText}>
                  Généré le {generationDate}
                </Text>
                <Text style={styles.footerText}>Page 1</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
