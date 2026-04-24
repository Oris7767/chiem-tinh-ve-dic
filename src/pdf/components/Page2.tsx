/**
 * Page 2: 16 D-Varga Charts
 * Grid layout 4x4 without borders for maximum space
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { page2Styles, colors, fontSizes, spacing } from '../styles';
import { PdfReportData, PdfVargaChart } from '../types';

// 16 Vargas data
const VARGAS_DATA: Array<{ id: string; name: string; key: string }> = [
  { id: 'D1', name: 'Rasi', key: 'D1' },
  { id: 'D2', name: 'Hora', key: 'D2' },
  { id: 'D3', name: 'Drekkana', key: 'D3' },
  { id: 'D4', name: 'Chaturamsa', key: 'D4' },
  { id: 'D7', name: 'Saptamsa', key: 'D7' },
  { id: 'D9', name: 'Navamsa', key: 'D9' },
  { id: 'D10', name: 'Dasamsa', key: 'D10' },
  { id: 'D12', name: 'Dwadamsa', key: 'D12' },
  { id: 'D16', name: 'Shodasamsa', key: 'D16' },
  { id: 'D20', name: 'Vimsamsa', key: 'D20' },
  { id: 'D24', name: 'Siddhamsa', key: 'D24' },
  { id: 'D27', name: 'Nakshatramsa', key: 'D27' },
  { id: 'D30', name: 'Trimsamsa', key: 'D30' },
  { id: 'D40', name: 'Khavedamsa', key: 'D40' },
  { id: 'D45', name: 'Akshvedamsa', key: 'D45' },
  { id: 'D60', name: 'Shashtiamsa', key: 'D60' },
];

interface Page2Props {
  data: PdfReportData;
}

// Single Varga Chart Cell
const VargaCell: React.FC<{
  varga: { id: string; name: string; key: string };
  image?: string;
}> = ({ varga, image }) => (
  <View style={page2Styles.vargaCell}>
    <Text style={page2Styles.vargaTitle}>
      {varga.id}
    </Text>
    {image ? (
      <Image src={image} style={page2Styles.vargaImage} />
    ) : (
      <View style={{
        width: '100%',
        height: '85%',
        backgroundColor: colors.creamLight,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 8, color: colors.textLight }}>N/A</Text>
      </View>
    )}
  </View>
);

// Page 2 Header
const Page2Header: React.FC = () => (
  <View style={page2Styles.header}>
    <Text style={page2Styles.headerTitle}>HỆ THỐNG 16 D-VARGA (PHÂN CUNG)</Text>
    <Text style={page2Styles.headerSubtitle}>Theo hệ thống Parashara - Divisional Charts</Text>
  </View>
);

export const Page2: React.FC<Page2Props> = ({ data }) => {
  return (
    <View style={page2Styles.container}>
      {/* Header */}
      <Page2Header />
      
      {/* Vargas Grid 4x4 */}
      <View style={page2Styles.vargasGrid}>
        {VARGAS_DATA.map((varga) => (
          <VargaCell
            key={varga.key}
            varga={varga}
            image={data.vargaChartImages?.[varga.key]}
          />
        ))}
      </View>
      
      {/* Footer */}
      <Text style={page2Styles.footer}>Chiêm Tinh Vệ Đà - Vedic Astrology</Text>
    </View>
  );
};
