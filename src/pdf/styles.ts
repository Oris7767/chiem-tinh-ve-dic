/**
 * PDF Styles - StyleSheet.create() cho @react-pdf/renderer
 * Màu sắc cổ điển: Kem nhạt (#FDF5E6) và Nâu trầm (#8B4513)
 */

import { StyleSheet } from '@react-pdf/renderer';

// Màu sắc cổ điển
export const colors = {
  // Background
  cream: '#FDF5E6',
  creamLight: '#FFF8F0',
  creamDark: '#F5E6D3',
  
  // Primary - Nâu trầm
  brown: '#8B4513',
  brownDark: '#6B3410',
  brownLight: '#A0522D',
  brownPale: '#DEB887',
  
  // Text
  textDark: '#2C1810',
  textMedium: '#5C4033',
  textLight: '#8B7355',
  
  // Borders
  border: '#C4A77D',
  borderDark: '#8B7355',
  
  // Status
  retrograde: '#B22222',
  direct: '#228B22',
  
  // White
  white: '#FFFFFF',
  black: '#000000',
};

// Typography
export const fonts = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  oblique: 'Helvetica-Oblique',
  boldOblique: 'Helvetica-BoldOblique',
};

// Font sizes
export const fontSizes = {
  title: 18,
  subtitle: 14,
  section: 11,
  body: 9,
  small: 7,
  tiny: 5,
};

// Spacing
export const spacing = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 15,
  xxl: 20,
};

// Common styles
export const commonStyles = StyleSheet.create({
  // Containers
  page: {
    backgroundColor: colors.cream,
    padding: spacing.lg,
    fontFamily: fonts.regular,
  },
  pageWithMargin: {
    backgroundColor: colors.cream,
    padding: spacing.md,
  },
  
  // Header
  header: {
    backgroundColor: colors.brown,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.subtitle,
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.cream,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  
  // Sections
  section: {
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
    marginBottom: spacing.md,
  },
  sectionHeader: {
    backgroundColor: colors.brown,
    padding: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.white,
    textAlign: 'center',
  },
  sectionContent: {
    padding: spacing.sm,
  },
  
  // Table styles
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.brownPale,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  tableHeaderText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: colors.creamLight,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  tableCell: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  tableCellBold: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  
  // Text styles
  text: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.textDark,
  },
  textBold: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textDark,
  },
  textSmall: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMedium,
  },
  textTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.title,
    color: colors.brown,
  },
  
  // Flex helpers
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  between: {
    justifyContent: 'space-between',
  },
  around: {
    justifyContent: 'space-around',
  },
  
  // Spacing helpers
  mt: {
    marginTop: spacing.md,
  },
  mb: {
    marginBottom: spacing.md,
  },
  ml: {
    marginLeft: spacing.md,
  },
  mr: {
    marginRight: spacing.md,
  },
  pa: {
    padding: spacing.md,
  },
  
  // Border helpers
  border: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
  },
  borderRadius: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    textAlign: 'center',
    fontFamily: fonts.oblique,
    fontSize: fontSizes.tiny,
    color: colors.textLight,
  },
});

// Page 1 specific styles
export const page1Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    minHeight: 180,
  },
  chartSection: {
    width: '62%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brown,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartImage: {
    width: '95%',
    height: '95%',
    objectFit: 'contain',
  },
  dasaSection: {
    width: '38%',
    marginLeft: spacing.sm,
  },
  currentDasha: {
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  currentDashaTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.brown,
    marginBottom: spacing.xs,
  },
  currentDashaPlanet: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textDark,
  },
  currentDashaDate: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.tiny,
    color: colors.textMedium,
    marginTop: spacing.xs,
  },
  dashaTableHeader: {
    backgroundColor: colors.brown,
    padding: spacing.xs,
  },
  dashaTableTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.white,
  },
  dashaTableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  dashaTableCell: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  dashaTableCellBold: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  planetarySection: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.brown,
  },
  planetaryHeader: {
    backgroundColor: colors.brown,
    padding: spacing.sm,
  },
  planetaryTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.white,
    textAlign: 'center',
  },
  planetaryTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.brownPale,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  planetaryTableHeaderText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  planetaryTableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  planetaryTableCell: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  motionDirect: {
    color: colors.direct,
  },
  motionRetrograde: {
    color: colors.retrograde,
  },
});

// Page 2 specific styles (Vargas)
export const page2Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.brown,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.subtitle,
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.cream,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    textAlign: 'center',
    fontFamily: fonts.oblique,
    fontSize: fontSizes.tiny,
    color: colors.textLight,
  },
  vargasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  vargaCell: {
    width: '25%',
    aspectRatio: 1,
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    // NO border for maximum space
  },
  vargaTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.tiny,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 2,
  },
  vargaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

// Helper function to get column widths for planetary table
export const getPlanetaryColumnWidths = () => [
  25, // Planet name
  15, // Sign
  20, // Position
  10, // House
  25, // Nakshatra
  15, // Lord
  8,  // Pada
  12, // Motion
];
