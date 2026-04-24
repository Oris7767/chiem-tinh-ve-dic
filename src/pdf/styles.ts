/**
 * PDF Styles - @react-pdf/renderer
 * Layout: Chart LEFT (2/3) | DASA RIGHT (1/3) | Planet table under Chart
 */

import { StyleSheet } from '@react-pdf/renderer';

// Colors
export const colors = {
  cream: '#FDF5E6',
  creamLight: '#FFF8F0',
  creamDark: '#F5E6D3',
  brown: '#8B4513',
  brownDark: '#6B3410',
  brownLight: '#A0522D',
  brownPale: '#DEB887',
  textDark: '#2C1810',
  textMedium: '#5C4033',
  textLight: '#8B7355',
  border: '#C4A77D',
  retrograde: '#B22222',
  direct: '#228B22',
  white: '#FFFFFF',
  black: '#000000',
};

// Typography - Using Roboto (registered in fonts.ts)
export const fonts = {
  regular: 'Roboto',
  bold: 'Roboto',
};

// Font sizes
export const fontSizes = {
  title: 16,
  subtitle: 12,
  section: 10,
  body: 9,
  small: 8,
  tiny: 6,
};

// Spacing
export const spacing = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
};

// Common styles
export const commonStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.brown,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 8,
    color: colors.cream,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 6,
    color: colors.textLight,
  },
});

// Page 1 styles
export const page1Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  // Top section: Chart (LEFT, 2/3) + Dasa (RIGHT, 1/3)
  topSection: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },

  // Chart container - 2/3 width, centered
  chartWrapper: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartSection: {
    width: 260,
    height: 260,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brown,
  },
  chartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  // Dasa section - 1/3 width
  dasaSection: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  // Current dasha info
  currentDasha: {
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  currentDashaTitle: {
    fontFamily: fonts.bold,
    fontSize: 7,
    color: colors.brown,
    marginBottom: 1,
  },
  currentDashaPlanet: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.textDark,
  },
  currentDashaDate: {
    fontFamily: fonts.regular,
    fontSize: 6,
    color: colors.textMedium,
    marginTop: 1,
  },

  // Dasa table styles - compact
  dashaTableHeader: {
    backgroundColor: colors.brown,
    padding: spacing.xs,
  },
  dashaTableTitle: {
    fontFamily: fonts.bold,
    fontSize: 6,
    color: colors.white,
  },
  dashaTableRow: {
    flexDirection: 'row',
    paddingVertical: 1,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  dashaTableCell: {
    fontFamily: fonts.regular,
    fontSize: 6,
    color: colors.textDark,
  },
  dashaTableCellBold: {
    fontFamily: fonts.bold,
    fontSize: 6,
    color: colors.textDark,
  },

  // Planetary table - under chart, only 2/3 width
  planetarySection: {
    width: '65%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.brown,
  },
  planetaryHeader: {
    backgroundColor: colors.brown,
    padding: spacing.xs,
  },
  planetaryTitle: {
    fontFamily: fonts.bold,
    fontSize: 7,
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
    fontSize: 6,
    color: colors.textDark,
    textAlign: 'center',
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
    fontSize: 6,
    color: colors.textDark,
    textAlign: 'center',
  },
  motionDirect: {
    color: colors.direct,
  },
  motionRetrograde: {
    color: colors.retrograde,
  },
});

// Page 2 styles
export const page2Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.brown,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 8,
    color: colors.cream,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  vargasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vargaCell: {
    width: '25%',
    aspectRatio: 1,
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vargaTitle: {
    fontFamily: fonts.bold,
    fontSize: 6,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 1,
  },
  vargaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});
