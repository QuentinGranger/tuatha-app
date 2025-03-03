import { View, Text, Image } from '@react-pdf/renderer';
import styles from '../styles';

const LOGO_PATH = null; // Temporairement désactivé jusqu'à ce que le logo soit disponible

export const ProgramHeader = ({ program }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <View>
        {LOGO_PATH && (
          <Image 
            src={LOGO_PATH}
            style={styles.logo}
          />
        )}
        <Text style={styles.title}>{program.title || 'Programme personnalisé'}</Text>
        <Text style={styles.subtitle}>Programme personnalisé</Text>
      </View>
      <View style={styles.headerInfo}>
        <Text style={styles.value}>
          {program.startDate && program.endDate ? 
            `Du ${new Date(program.startDate).toLocaleDateString('fr-FR')} au ${new Date(program.endDate).toLocaleDateString('fr-FR')}` :
            'Durée non spécifiée'
          }
        </Text>
        <Text style={[styles.value, { color: '#FF721C' }]}>
          {program.status === 'ACTIVE' ? 'Programme actif' : 'Modèle de programme'}
        </Text>
      </View>
    </View>
  </View>
);
