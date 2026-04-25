/**
 * Page 2: 15 D-Varga Charts (D1 excluded) - Grid 3x5
 * Split into 2 pages if needed to avoid orphaned content
 */

import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { page2Styles, page2bStyles, commonStyles, colors } from '../styles';
import { PdfReportData } from '../types';

// 15 Vargas (D1 excluded)
const VARGAS_LIST = [
  'D2', 'D3', 'D4', 'D7', 'D9',
  'D10', 'D12', 'D16', 'D20', 'D24',
  'D27', 'D30', 'D40', 'D45', 'D60'
];

interface Page2Props {
  data: PdfReportData;
}

// Single Varga Cell for Page2a (smaller)
const VargaCell2a: React.FC<{
  vargaId: string;
  image?: string;
}> = ({ vargaId, image }) => (
  <View style={page2Styles.vargaCell}>
    <Text style={page2Styles.vargaTitle}>{vargaId}</Text>
    {image ? (
      <Image src={image} style={page2Styles.vargaImage} />
    ) : (
      <View style={{ flex: 1, width: '100%', backgroundColor: colors.creamLight, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Roboto', fontSize: 6, color: colors.textLight }}>-</Text>
      </View>
    )}
  </View>
);

// Single Varga Cell for Page2b (larger)
const VargaCell2b: React.FC<{
  vargaId: string;
  image?: string;
}> = ({ vargaId, image }) => (
  <View style={page2bStyles.vargaCell}>
    <Text style={page2bStyles.vargaTitle}>{vargaId}</Text>
    {image ? (
      <Image src={image} style={page2bStyles.vargaImage} />
    ) : (
      <View style={{ flex: 1, width: '100%', backgroundColor: colors.creamLight, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Roboto', fontSize: 6, color: colors.textLight }}>-</Text>
      </View>
    )}
  </View>
);

// Header for Page2a
const Page2Header: React.FC = () => (
  <View style={page2Styles.header}>
    <Text style={page2Styles.headerTitle}>HỆ THỐNG 16 D-VARGA (PHÂN CUNG)</Text>
    <Text style={page2Styles.headerSubtitle}>Theo hệ thống Parashara - Biểu đồ Chia phần (D1 xem trang trước)</Text>
  </View>
);

// Header for Page2b
const Page2bHeader: React.FC = () => (
  <View style={page2bStyles.header}>
    <Text style={page2bStyles.headerTitle}>HỆ THỐNG 16 D-VARGA (PHÂN CUNG)</Text>
    <Text style={page2bStyles.headerSubtitle}>Tiếp theo - Biểu đồ D12 đến D60</Text>
  </View>
);

// Page 2a: First 6 Vargas (2 rows)
export const Page2a: React.FC<Page2Props> = ({ data }) => {
  const vargaImages = data.vargaChartImages || {};

  const gridItems = [
    VARGAS_LIST.slice(0, 3),  // Row 1: D2, D3, D4
    VARGAS_LIST.slice(3, 6),  // Row 2: D7, D9, D10
  ];

  return (
    <View style={page2Styles.container}>
      <Page2Header />

      {/* Vargas Grid - First 6 */}
      <View style={page2Styles.vargasGrid}>
        {gridItems.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={page2Styles.vargaRow}>
            {row.map((vargaId) => (
              <VargaCell2a
                key={vargaId}
                vargaId={vargaId}
                image={vargaImages[vargaId]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={commonStyles.footer}>Được tạo bởi Votive VedicVN 2026, Mọi quyền được bảo lưu</Text>
    </View>
  );
};

// Page 2b: Remaining 9 Vargas (3 rows)
export const Page2b: React.FC<Page2Props> = ({ data }) => {
  const vargaImages = data.vargaChartImages || {};

  const gridItems = [
    VARGAS_LIST.slice(6, 9),   // Row 3: D12, D16, D20
    VARGAS_LIST.slice(9, 12),  // Row 4: D24, D27, D30
    VARGAS_LIST.slice(12, 15), // Row 5: D40, D45, D60
  ];

  return (
    <View style={page2bStyles.container}>
      <Page2bHeader />

      {/* Vargas Grid - Remaining 9 */}
      <View style={page2bStyles.vargasGrid}>
        {gridItems.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={page2bStyles.vargaRow}>
            {row.map((vargaId) => (
              <VargaCell2b
                key={vargaId}
                vargaId={vargaId}
                image={vargaImages[vargaId]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={commonStyles.footer}>Được tạo bởi Votive VedicVN 2026, Mọi quyền được bảo lưu</Text>
    </View>
  );
};

// Original Page2 for backward compatibility (exports both components)
export const Page2: React.FC<Page2Props> = ({ data }) => {
  return (
    <View>
      <Page2a data={data} />
      <Page2b data={data} />
    </View>
  );
};
