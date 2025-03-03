import { View, Text } from '@react-pdf/renderer';
import styles from '../styles';

export const FoodSection = ({ foods }) => {
  if (!foods || foods.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alimentation recommandée</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCell, { flex: 2 }]}>
            <Text style={styles.tableCellHeader}>Aliment</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>Catégorie</Text>
          </View>
          <View style={[styles.tableCell, { flex: 2 }]}>
            <Text style={styles.tableCellHeader}>Description</Text>
          </View>
        </View>
        {foods.map((food, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.tableCellContent}>{food.name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellContent}>{food.category}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.tableCellContent}>{food.description || '-'}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        Note: Ces recommandations alimentaires sont données à titre indicatif. 
        Adaptez les portions et la fréquence selon vos besoins et préférences.
      </Text>
    </View>
  );
};
