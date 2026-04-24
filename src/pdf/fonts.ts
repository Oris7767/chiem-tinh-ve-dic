/**
 * PDF Fonts - Register Roboto from local files for Vietnamese support
 */

import { Font } from '@react-pdf/renderer';

// Register Roboto font family from local files
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: './components/roboto/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: './components/roboto/Roboto-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});
