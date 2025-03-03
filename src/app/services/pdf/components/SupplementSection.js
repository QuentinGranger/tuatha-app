import { View, Text } from '@react-pdf/renderer';
import styles from '../styles';

export const SupplementSection = ({ supplements }) => {
  if (!supplements || supplements.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Suppléments recommandés</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCell, { flex: 2 }]}>
            <Text style={styles.tableCellHeader}>Supplément</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>Dosage</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>Fréquence</Text>
          </View>
          <View style={[styles.tableCell, { flex: 2 }]}>
            <Text style={styles.tableCellHeader}>Notes</Text>
          </View>
        </View>
        {supplements.map((supplement, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.tableCellContent}>{supplement.name}</Text>
              <Text style={styles.itemDetail}>{supplement.type}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellContent}>{supplement.dosage || '-'}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellContent}>{supplement.frequency || '-'}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.tableCellContent}>{supplement.notes || '-'}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        Important: Consultez votre professionnel de santé avant de commencer toute 
        supplémentation. Les dosages peuvent être ajustés selon vos besoins spécifiques.
      </Text>
    </View>
  );
};
