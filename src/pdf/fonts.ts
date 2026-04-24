/**
 * PDF Fonts - Register Roboto from local files for Vietnamese support
 */

import { Font } from '@react-pdf/renderer';
import RobotoRegular from '../components/roboto/Roboto-Regular.ttf';
import RobotoBold from '../components/roboto/Roboto-Bold.ttf';

// Register Roboto font family
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: RobotoRegular,
      fontWeight: 'normal',
    },
    {
      src: RobotoBold,
      fontWeight: 'bold',
    },
  ],
});
