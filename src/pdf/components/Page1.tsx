/**
 * Page 1: Overview & Dasa System
 * - Left: South Indian Chart (large)
 * - Right: 3 Dasa tables (Maha, Antar, Pratyantar)
 * - Bottom: Planetary Details table
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { page1Styles, commonStyles, colors, fonts, fontSizes, spacing } from '../styles';
import { PdfReportData } from '../types';

// Planet name mapping (Vietnamese ASCII)
const PLANET_NAMES_VI: Record<string, string> = {
  'Sun': 'Mat Troi',
  'Moon': 'Mat Trang',
  'Mars': 'Sao Hoa',
  'Mercury': 'Sao Thuy',
  'Jupiter': 'Sao Moc',
  'Venus': 'Sao Kim',
  'Saturn': 'Sao Tho',
  'Rahu': 'Sao Rahu',
  'Ketu': 'Sao Ketu',
  'Uranus': 'Sao Thien Vuong',
  'Neptune': 'Sao Hai Vuong',
  'Pluto': 'Sao Diem Vuong',
};

// Planet short names
const PLANET_SHORT: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

// Zodiac signs (Vietnamese)
const ZODIAC_SIGNS_VI = [
  'Bach Duong', 'Kim Nguu', 'Song Tu', 'Cu Giai', 'Su Tu', 'Xu Nu',
  'Thien Binh', 'Bo Cap', 'Nhan Ma', 'Ma Ket', 'Bao Binh', 'Song Ngu'
];

// Zodiac signs short
const ZODIAC_SIGNS_SHORT = [
  'Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi',
  'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'
];

interface Page1Props {
  data: PdfReportData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatDegree(longitude: number): string {
  const totalDegrees = longitude % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
}

function getPlanetName(name: string): string {
  return PLANET_NAMES_VI[name] || name;
}

function getPlanetShort(name: string): string {
  return PLANET_SHORT[name] || name.substring(0, 2);
}

// Header Component
const Header: React.FC<{ data: PdfReportData }> = ({ data }) => (
  <View style={commonStyles.header}>
    <Text style={commonStyles.headerTitle}>LA SO CHIEM TINH VE DA</Text>
    <Text style={commonStyles.headerSubtitle}>
      {data.birthData?.name || 'Khong ten'} - {data.birthData?.birthDate || ''} {data.birthData?.birthTime || ''} - {data.birthData?.location || ''}
    </Text>
  </View>
);

// Main Chart Component
const MainChart: React.FC<{ image: string | undefined }> = ({ image }) => (
  <View style={page1Styles.chartSection}>
    {image ? (
      <Image src={image} style={page1Styles.chartImage} />
    ) : (
      <Text style={{ color: colors.textLight }}>Đang tải biểu đồ...</Text>
    )}
  </View>
);

// Current Dasha Component
const CurrentDasha: React.FC<{ data: PdfReportData }> = ({ data }) => {
  const current = data.chartData.dashas?.current;

  if (!current) return null;

  return (
    <View style={page1Styles.currentDasha}>
      <Text style={page1Styles.currentDashaTitle}>DAI VAN HIEN TAI</Text>
      <Text style={page1Styles.currentDashaPlanet}>{getPlanetName(current.planet)}</Text>
      <Text style={page1Styles.currentDashaDate}>
        {formatDate(current.startDate)} - {formatDate(current.endDate)}
      </Text>
      <Text style={page1Styles.currentDashaDate}>
        Qua: {current.elapsed?.years || 0}y {current.elapsed?.months || 0}m | Con: {current.remaining?.years || 0}y {current.remaining?.months || 0}m
      </Text>
    </View>
  );
};

// Dasa Table Component
const DasaTable: React.FC<{
  title: string;
  items: Array<{ planet: string; startDate: string }>;
}> = ({ title, items }) => (
  <View style={{ marginBottom: spacing.sm }}>
    <View style={page1Styles.dashaTableHeader}>
      <Text style={page1Styles.dashaTableTitle}>{title}</Text>
    </View>
    <View style={page1Styles.dashaTableRow}>
      <Text style={[page1Styles.dashaTableCellBold, { flex: 1 }]}>Hanh Tinh</Text>
      <Text style={[page1Styles.dashaTableCellBold, { flex: 1, textAlign: 'right' }]}>Bat Dau</Text>
    </View>
    {items.slice(0, 12).map((item, index) => (
      <View key={index} style={[page1Styles.dashaTableRow, index % 2 === 1 && { backgroundColor: colors.creamLight }]}>
        <Text style={[page1Styles.dashaTableCell, { flex: 1 }]}>
          {getPlanetName(item.planet)}
        </Text>
        <Text style={[page1Styles.dashaTableCell, { flex: 1, textAlign: 'right' }]}>
          {formatDate(item.startDate).substring(0, 10)}
        </Text>
      </View>
    ))}
  </View>
);

// Planetary Details Table Component - Fixed layout with proper flex columns
const PlanetaryTable: React.FC<{ data: PdfReportData }> = ({ data }) => {
  // Column widths as flex values for proper alignment
  const colWidths = { ht: 8, cung: 8, viTri: 14, nha: 6, nakshatra: 20, chuNha: 10, pd: 6, cd: 6 };

  return (
    <View style={page1Styles.planetarySection}>
      <View style={page1Styles.planetaryHeader}>
        <Text style={page1Styles.planetaryTitle}>CHI TIET CAC HANH TINH (GRAHA)</Text>
      </View>

      {/* Table Header - Fixed structure with flex */}
      <View style={page1Styles.planetaryTableHeader}>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.ht }]}>HT</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.cung, textAlign: 'center' }]}>Cung</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.viTri, textAlign: 'center' }]}>Vi Tri</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.nha, textAlign: 'center' }]}>Nha</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.nakshatra, textAlign: 'center' }]}>Nakshatra</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.chuNha, textAlign: 'center' }]}>Chu Nha</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.pd, textAlign: 'center' }]}>Pd</Text>
        <Text style={[page1Styles.planetaryTableHeaderText, { flex: colWidths.cd, textAlign: 'center' }]}>Cd</Text>
      </View>

      {/* Table Rows */}
      {data.chartData.planets.map((planet, index) => (
        <View
          key={planet.id}
          style={[
            page1Styles.planetaryTableRow,
            index % 2 === 1 && { backgroundColor: colors.creamLight }
          ]}
        >
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.ht }]}>
            {getPlanetShort(planet.name)}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.cung, textAlign: 'center' }]}>
            {ZODIAC_SIGNS_SHORT[planet.sign]}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.viTri, textAlign: 'center' }]}>
            {formatDegree(planet.longitude)}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.nha, textAlign: 'center' }]}>
            {planet.house}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.nakshatra, textAlign: 'center' }]}>
            {planet.nakshatra.name}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.chuNha, textAlign: 'center' }]}>
            {planet.nakshatra.lord}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { flex: colWidths.pd, textAlign: 'center' }]}>
            {planet.nakshatra.pada}
          </Text>
          <Text
            style={[
              page1Styles.planetaryTableCell,
              { flex: colWidths.cd, textAlign: 'center' },
              planet.retrograde ? page1Styles.motionRetrograde : page1Styles.motionDirect
            ]}
          >
            {planet.retrograde ? 'Ng' : 'Th'}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Main Page 1 Component
export const Page1: React.FC<Page1Props> = ({ data }) => {
  // Maha Dasa sequence
  const mahaDashas = data.chartData.dashas?.sequence?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];

  // Antar Dasa (sub-periods of current Maha Dasa)
  const antarDashas = data.chartData.dashas?.current?.antardashas?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];

  // Pratyantar Dasa (sub-sub-periods) - from first Antardasa if available
  const pratyantarDashas = data.chartData.dashas?.current?.antardashas?.[0]?.pratyantars?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];

  return (
    <View style={page1Styles.container}>
      {/* Header */}
      <Header data={data} />
      
      {/* Top Section: Chart + Dasa */}
      <View style={page1Styles.topSection}>
        {/* Left: Main Chart */}
        <MainChart image={data.mainChartImage} />
        
        {/* Right: Dasa Tables */}
        <View style={page1Styles.dasaSection}>
          <CurrentDasha data={data} />
          <DasaTable title="VIMSHOTTARI MAHA DASA" items={mahaDashas} />
          <DasaTable title="ANTAR DASA (TIEU VAN)" items={antarDashas} />
          <DasaTable title="PRATYANTAR DASA" items={pratyantarDashas} />
        </View>
      </View>
      
      {/* Bottom: Planetary Details */}
      <PlanetaryTable data={data} />
      
      {/* Footer */}
      <Text style={commonStyles.footer}>Generated by Votive VedicVN 2026, All rights reserved</Text>
    </View>
  );
};
