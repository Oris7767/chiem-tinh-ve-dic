/**
 * PDF Fonts Configuration
 * Register Google Fonts (Roboto) for Vietnamese support
 */

import { Font } from '@react-pdf/renderer';

// Register Roboto font family for Vietnamese text support
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu5mx.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvFw.ttf',
      fontWeight: 700,
      fontStyle: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf',
      fontWeight: 700,
      fontStyle: 'italic',
    },
  ],
});

// Export font names for use in styles
export const pdfFonts = {
  regular: 'Roboto',
  bold: 'Roboto',
  italic: 'Roboto',
  boldItalic: 'Roboto',
};
