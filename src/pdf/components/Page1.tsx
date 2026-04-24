/**
 * Page 1: Overview & Dasa System
 * - Left: South Indian Chart (large)
 * - Right: 3 Dasa tables (Maha, Antar, Pratyantar)
 * - Bottom: Planetary Details table
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { page1Styles, colors, fonts, fontSizes, spacing } from '../styles';
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
  <View style={page1Styles.header}>
    <Text style={page1Styles.headerTitle}>LÁ SỐ CHIÊM TINH VỆ ĐÀ</Text>
    <Text style={page1Styles.headerSubtitle}>
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
      <Text style={page1Styles.currentDashaTitle}>ĐẠI VẬN HIỆN TẠI</Text>
      <Text style={page1Styles.currentDashaPlanet}>{getPlanetName(current.planet)}</Text>
      <Text style={page1Styles.currentDashaDate}>
        {formatDate(current.startDate)} - {formatDate(current.endDate)}
      </Text>
      <Text style={page1Styles.currentDashaDate}>
        Qua: {current.elapsed?.years || 0}y {current.elapsed?.months || 0}m | Còn: {current.remaining?.years || 0}y {current.remaining?.months || 0}m
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
      <Text style={[page1Styles.dashaTableCellBold, { width: '50%' }]}>Hành Tinh</Text>
      <Text style={[page1Styles.dashaTableCellBold, { width: '50%' }]}>Bắt Đầu</Text>
    </View>
    {items.slice(0, 12).map((item, index) => (
      <View key={index} style={[page1Styles.dashaTableRow, index % 2 === 1 && { backgroundColor: colors.creamLight }]}>
        <Text style={[page1Styles.dashaTableCell, { width: '50%' }]}>
          {getPlanetName(item.planet)}
        </Text>
        <Text style={[page1Styles.dashaTableCell, { width: '50%' }]}>
          {formatDate(item.startDate).substring(0, 10)}
        </Text>
      </View>
    ))}
  </View>
);

// Planetary Details Table Component
const PlanetaryTable: React.FC<{ data: PdfReportData }> = ({ data }) => {
  const columns = ['HT', 'Cung', 'Vị Trí', 'Nhã', 'Nakshatra', 'Chủ Nhà', 'Pd', 'Cd'];
  const colWidths = [18, 12, 18, 10, 20, 14, 8, 10];
  
  return (
    <View style={page1Styles.planetarySection}>
      <View style={page1Styles.planetaryHeader}>
        <Text style={page1Styles.planetaryTitle}>CHI TIẾT CÁC HÀNH TINH (GRAHA)</Text>
      </View>
      
      {/* Table Header */}
      <View style={page1Styles.planetaryTableHeader}>
        {columns.map((col, i) => (
          <Text
            key={i}
            style={[
              page1Styles.planetaryTableHeaderText,
              { width: colWidths[i], textAlign: i === 0 ? 'left' : 'center' }
            ]}
          >
            {col}
          </Text>
        ))}
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
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[0] }]}>
            {getPlanetShort(planet.name)}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[1], textAlign: 'center' }]}>
            {ZODIAC_SIGNS_SHORT[planet.sign]}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[2], textAlign: 'center' }]}>
            {formatDegree(planet.longitude)}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[3], textAlign: 'center' }]}>
            {planet.house}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[4], textAlign: 'center' }]}>
            {planet.nakshatra.name}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[5], textAlign: 'center' }]}>
            {planet.nakshatra.lord}
          </Text>
          <Text style={[page1Styles.planetaryTableCell, { width: colWidths[6], textAlign: 'center' }]}>
            {planet.nakshatra.pada}
          </Text>
          <Text
            style={[
              page1Styles.planetaryTableCell,
              { width: colWidths[7], textAlign: 'center' },
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

// Get items from current position onwards (for future dasa display)
function getFutureItems<T extends { startDate?: string }>(
  items: T[],
  maxItems: number = 7
): T[] {
  if (!items || items.length === 0) return [];

  const now = new Date();

  // Find current index (first item where startDate <= now)
  let currentIndex = 0;
  for (let i = 0; i < items.length; i++) {
    const startDate = items[i]?.startDate ? new Date(items[i].startDate) : null;
    if (startDate && startDate <= now) {
      currentIndex = i;
    } else {
      break;
    }
  }

  // Return 7 items starting from current
  return items.slice(currentIndex, currentIndex + maxItems);
}

// Main Page 1 Component
export const Page1: React.FC<Page1Props> = ({ data }) => {
  const mahaDashas = data.chartData.dashas?.sequence?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];
  
  const antarDashas = data.chartData.dashas?.current?.antardashas?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];
  
  const pratyantarDashas = data.chartData.dashas?.current?.antardashas?.[0]?.pratyantars?.map(d => ({
    planet: d.planet,
    startDate: d.startDate
  })) || [];

  return (
    <View style={page1Styles.container}>
      {/* Header */}
      <Header data={data} />
      
      {/* Top Section: Dasa (left) + Chart (right) */}
      <View style={page1Styles.topSection}>
        {/* Left: Dasa Tables */}
        <View style={page1Styles.dasaSection}>
          <CurrentDasha data={data} />
          <DasaTable title="VIMSHOTTARI MAHA DASA" items={mahaDashas} />
          <DasaTable title="ANTAR DASA" items={antarDashas} />
          <DasaTable title="PRATYANTAR DASA" items={pratyantarDashas} />
        </View>

        {/* Right: Main Chart */}
        <MainChart image={data.mainChartImage} />
      </View>
      
      {/* Bottom: Planetary Details */}
      <PlanetaryTable data={data} />
      
      {/* Footer */}
      <Text style={page1Styles.footer}>Chiêm Tinh Vệ Đà - Vedic Astrology</Text>
    </View>
  );
};
