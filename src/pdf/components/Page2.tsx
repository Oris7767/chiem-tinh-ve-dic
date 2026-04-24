/**
 * Page 2: 16 D-Varga Charts - Grid 4x4
 */

import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { page2Styles, commonStyles, colors } from '../styles';
import { PdfReportData } from '../types';

// Standard 16 Vargas
const VARGAS_LIST = [
  'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
  'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
];

interface Page2Props {
  data: PdfReportData;
}

// Single Varga Cell
const VargaCell: React.FC<{
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

// Header
const Page2Header: React.FC = () => (
  <View style={page2Styles.header}>
    <Text style={page2Styles.headerTitle}>HỆ THỐNG 16 D-VARGA (PHÂN CUNG)</Text>
    <Text style={page2Styles.headerSubtitle}>Theo hệ thống Parashara - Biểu đồ Chia phần</Text>
  </View>
);

export const Page2: React.FC<Page2Props> = ({ data }) => {
  // Get varga images from data
  const vargaImages = data.vargaChartImages || {};
  const vargas = data.chartData.vargas || [];

  // Log for debugging
  console.log('Page2 - vargas count:', vargas.length);
  console.log('Page2 - vargaImages keys:', Object.keys(vargaImages));

  return (
    <View style={page2Styles.container}>
      <Page2Header />

      {/* Vargas Grid 4x4 */}
      <View style={page2Styles.vargasGrid}>
        {VARGAS_LIST.map((vargaId) => (
          <VargaCell
            key={vargaId}
            vargaId={vargaId}
            image={vargaImages[vargaId]}
          />
        ))}
      </View>

      {/* Footer */}
      <Text style={commonStyles.footer}>Được tạo bởi Votive VedicVN 2026, Mọi quyền được bảo lưu</Text>
    </View>
  );
};
