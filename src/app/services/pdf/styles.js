import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Montserrat',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #FF721C',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF721C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottom: '1 solid #eee',
    paddingBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  tableCellHeader: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCellContent: {
    fontSize: 10,
    color: '#333',
  },
  value: {
    fontSize: 12,
    color: '#333',
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 10,
    color: '#666',
  },
  exerciseImage: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    marginLeft: 10,
  },
  note: {
    fontSize: 9,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
  logo: {
    width: 120,
    marginBottom: 20,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    fontSize: 9,
    color: '#999',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    marginRight: 5,
  },
  divider: {
    borderBottom: '1 solid #eee',
    marginVertical: 10,
  },
});

export default styles;
