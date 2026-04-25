/**
 * PDF Module - Main Export
 * Tách biệt hoàn toàn với web UI components
 */

// Polyfills are initialized in main.tsx before this module is loaded

// Components
export { VedicPdfReport } from './VedicPdfReport';

// Functions
export { generatePDF, downloadPDF, generatePDFFromAppData } from './generatePDF';
export { transformChartDataForPDF, transformBirthDataForPDF } from './generatePDF';

// SVG utilities
export { generateMainChartSVG, generateMiniChartSVG, svgToBase64PNG, generatePDFChartImages } from './svgGenerators';

// Types
export * from './types';
