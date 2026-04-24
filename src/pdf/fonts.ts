/**
 * PDF Fonts - Register Roboto for Vietnamese support
 */

import { Font } from '@react-pdf/renderer';

// Register Roboto font family
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvFw.ttf',
      fontWeight: 'bold',
    },
  ],
});
