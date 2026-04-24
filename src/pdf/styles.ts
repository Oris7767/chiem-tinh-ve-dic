/**
 * PDF Styles - @react-pdf/renderer
 * Layout: LEFT 65% (Chart + Planet Table) | RIGHT 33% (DASA)
 */

import { StyleSheet } from '@react-pdf/renderer';

// Colors
export const colors = {
  cream: '#FDF5E6',
  creamLight: '#FFF8F0',
  creamDark: '#F5E6D3',
  brown: '#8B4513',
  brownPale: '#DEB887',
  textDark: '#2C1810',
  textMedium: '#5C4033',
  textLight: '#8B7355',
  border: '#C4A77D',
  retrograde: '#B22222',
  direct: '#228B22',
  white: '#FFFFFF',
};

// Common styles
export const commonStyles = StyleSheet.create({
  header: {
    backgroundColor: '#8B4513',
    padding: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Roboto',
    fontSize: 8,
    color: '#FDF5E6',
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 7,
    color: '#8B7355',
  },
});

// Page 1 styles
export const page1Styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Extra padding for footer
    backgroundColor: '#FDF5E6',
    fontFamily: 'Roboto',
    minHeight: '100%',
  },

  // Main Layout: LEFT 65% | RIGHT 33%
  mainLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },

  // LEFT Column: Chart + Planet Table
  leftColumn: {
    width: '65%',
  },

  // RIGHT Column: All DASA tables
  rightColumn: {
    width: '33%',
  },

  // Chart: compact fit with small padding
  chartSection: {
    width: '100%',
    aspectRatio: 1,
    border: '2pt solid #8B4513',
    backgroundColor: '#FFFFFF',
    padding: 2,
  },
  chartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  // Planet Table
  planetarySection: {
    marginTop: 5,
    border: '1pt solid #8B4513',
  },
  planetaryHeader: {
    backgroundColor: '#8B4513',
    padding: 4,
  },
  planetaryTitle: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  planetaryTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DEB887',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  // Specific widths: HT(10%), Cung(10%), ViTri(15%), Nha(8%), Nakshatra(25%), ChuNha(15%), Pd(8%), Cd(9%)
  planetaryTableHeaderText: {
    fontFamily: 'Roboto',
    fontSize: 6,
    color: '#2C1810',
    textAlign: 'center',
  },
  planetaryTableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderBottom: '0.5pt solid #C4A77D',
  },
  planetaryTableCell: {
    fontFamily: 'Roboto',
    fontSize: 6,
    color: '#2C1810',
    textAlign: 'center',
  },

  // Current Dasha
  currentDasha: {
    backgroundColor: '#F5E6D3',
    border: '1pt solid #C4A77D',
    padding: 6,
    marginBottom: 8,
  },
  currentDashaTitle: {
    fontFamily: 'Roboto',
    fontSize: 8,
    color: '#8B4513',
    marginBottom: 2,
  },
  currentDashaPlanet: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#2C1810',
  },
  currentDashaDate: {
    fontFamily: 'Roboto',
    fontSize: 7,
    color: '#5C4033',
    marginTop: 2,
  },

  // DASA Tables - Compact
  dasaTable: {
    marginBottom: 8,
  },
  dasaTableHeader: {
    backgroundColor: '#8B4513',
    padding: 3,
  },
  dasaTableTitle: {
    fontFamily: 'Roboto',
    fontSize: 7,
    color: '#FFFFFF',
  },
  dasaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
    borderBottom: '0.5pt solid #C4A77D',
  },
  dasaText: {
    fontFamily: 'Roboto',
    fontSize: 7,
    color: '#2C1810',
    lineHeight: 1.2,
  },
});

// Page 2 styles
export const page2Styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Extra padding for footer
    backgroundColor: '#FDF5E6',
    fontFamily: 'Roboto',
    minHeight: '100%',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Roboto',
    fontSize: 8,
    color: '#FDF5E6',
    textAlign: 'center',
    marginTop: 2,
  },
  vargasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vargaCell: {
    width: '25%',
    aspectRatio: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vargaTitle: {
    fontFamily: 'Roboto',
    fontSize: 7,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 2,
  },
  vargaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});
