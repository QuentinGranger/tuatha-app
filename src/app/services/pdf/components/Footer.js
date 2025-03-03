import { View, Text } from '@react-pdf/renderer';
import styles from '../styles';

export const Footer = ({ pageNumber }) => (
  <View style={styles.footer} fixed>
    <Text>© {new Date().getFullYear()} Tuatha - Tous droits réservés</Text>
    <Text style={{ marginTop: 5 }}>
      Ce programme est personnalisé et confidentiel.
    </Text>
    <Text style={styles.pageNumber}>
      Page {pageNumber}
    </Text>
  </View>
);
