/**
 * Page 1: Chart LEFT + DASA RIGHT | Planet table under Chart
 */

import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { page1Styles, commonStyles, colors, spacing } from '../styles';
import { PdfReportData } from '../types';

// Planet mappings
const PLANET_SHORT: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

const PLANET_NAMES: Record<string, string> = {
  'Sun': 'Mat Troi', 'Moon': 'Mat Trang', 'Mars': 'Sao Hoa',
  'Mercury': 'Sao Thuy', 'Jupiter': 'Sao Moc', 'Venus': 'Sao Kim',
  'Saturn': 'Sao Tho', 'Rahu': 'Sao Rahu', 'Ketu': 'Sao Ketu',
  'Uranus': 'Thien Vuong', 'Neptune': 'Hai Vuong', 'Pluto': 'Diem Vuong'
};

const ZODIAC_SHORT = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

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
  const deg = Math.floor(longitude % 30);
  const min = Math.floor((longitude % 30 - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

function getPlanetName(name: string): string {
  return PLANET_NAMES[name] || name;
}

function getPlanetShort(name: string): string {
  return PLANET_SHORT[name] || name.substring(0, 2);
}

// Get items from current position onwards
function getFutureItems<T extends { startDate?: string }>(items: T[], maxItems: number = 7): T[] {
  if (!items || items.length === 0) return [];
  const now = new Date();
  let currentIndex = 0;
  for (let i = 0; i < items.length; i++) {
    const startDate = items[i]?.startDate ? new Date(items[i].startDate) : null;
    if (startDate && startDate <= now) {
      currentIndex = i;
    } else {
      break;
    }
  }
  return items.slice(currentIndex, currentIndex + maxItems);
}

// Header
const Header: React.FC<{ data: PdfReportData }> = ({ data }) => (
  <View style={commonStyles.header}>
    <Text style={commonStyles.headerTitle}>LA SO CHIEM TINH VE DA</Text>
    <Text style={commonStyles.headerSubtitle}>
      {data.birthData?.name || 'Unknown'} - {data.birthData?.birthDate || ''} {data.birthData?.birthTime || ''} - {data.birthData?.location || ''}
    </Text>
  </View>
);

// Main Chart - LEFT side
const MainChart: React.FC<{ image?: string }> = ({ image }) => (
  <View style={page1Styles.chartWrapper}>
    <View style={page1Styles.chartSection}>
      {image ? (
        <Image src={image} style={page1Styles.chartImage} />
      ) : (
        <Text style={{ color: colors.textLight, fontSize: 8 }}>Dang tai bieu do...</Text>
      )}
    </View>
  </View>
);

// Current Dasha
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

// Dasa Table - compact with Planet + Start Date on same row
const DasaTable: React.FC<{
  title: string;
  items: Array<{ planet: string; startDate: string }>;
}> = ({ title, items }) => (
  <View style={{ marginBottom: spacing.xs }}>
    <View style={page1Styles.dashaTableHeader}>
      <Text style={page1Styles.dashaTableTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <View key={index} style={[
        page1Styles.dashaTableRow,
        index % 2 === 1 && { backgroundColor: colors.creamLight }
      ]}>
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

// Planetary Table - under chart, compact
const PlanetaryTable: React.FC<{ data: PdfReportData }> = ({ data }) => (
  <View style={page1Styles.planetarySection}>
    <View style={page1Styles.planetaryHeader}>
      <Text style={page1Styles.planetaryTitle}>CHI TIET CAC HANH TINH</Text>
    </View>
    <View style={page1Styles.planetaryTableHeader}>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 1 }]}>HT</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 1 }]}>Cung</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 1.2 }]}>Vi Tri</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 0.8 }]}>Nha</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 1.5 }]}>Nakshatra</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 1 }]}>Chu Nha</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 0.6 }]}>Pd</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { flex: 0.6 }]}>Cd</Text>
    </View>
    {data.chartData.planets.map((planet, index) => (
      <View key={planet.id} style={[
        page1Styles.planetaryTableRow,
        index % 2 === 1 && { backgroundColor: colors.creamLight }
      ]}>
        <Text style={[page1Styles.planetaryTableCell, { flex: 1 }]}>{getPlanetShort(planet.name)}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 1 }]}>{ZODIAC_SHORT[planet.sign]}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 1.2 }]}>{formatDegree(planet.longitude)}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 0.8 }]}>{planet.house}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 1.5 }]}>{planet.nakshatra.name}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 1 }]}>{planet.nakshatra.lord}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 0.6 }]}>{planet.nakshatra.pada}</Text>
        <Text style={[page1Styles.planetaryTableCell, { flex: 0.6 }]}>
          {planet.retrograde ? 'Ng' : 'Th'}
        </Text>
      </View>
    ))}
  </View>
);

// Main Page 1
export const Page1: React.FC<Page1Props> = ({ data }) => {
  // Maha Dasa - from current, max 12
  const mahaDashas = getFutureItems(
    data.chartData.dashas?.sequence?.map(d => ({ planet: d.planet, startDate: d.startDate })) || [],
    12
  );

  // Antar Dasa - from current, max 9
  const antarDashas = getFutureItems(
    data.chartData.dashas?.current?.antardashas?.map(d => ({ planet: d.planet, startDate: d.startDate })) || [],
    9
  );

  // Pratyantar Dasa - from first antar, max 9
  const pratyantarDashas = getFutureItems(
    data.chartData.dashas?.current?.antardashas?.[0]?.pratyantars?.map(d => ({ planet: d.planet, startDate: d.startDate })) || [],
    9
  );

  return (
    <View style={page1Styles.container}>
      <Header data={data} />

      {/* Top Section: Chart (LEFT, 2/3) + DASA (RIGHT, 1/3) */}
      <View style={page1Styles.topSection}>
        {/* LEFT: Main Chart */}
        <MainChart image={data.mainChartImage} />

        {/* RIGHT: Dasa Tables */}
        <View style={page1Styles.dasaSection}>
          <CurrentDasha data={data} />
          <DasaTable title="VIMSHOTTARI MAHA DASA" items={mahaDashas} />
          <DasaTable title="ANTAR DASA" items={antarDashas} />
          <DasaTable title="PRATYANTAR DASA" items={pratyantarDashas} />
        </View>
      </View>

      {/* Bottom: Planetary Table - under chart only */}
      <PlanetaryTable data={data} />

      {/* Footer */}
      <Text style={commonStyles.footer}>Generated by Votive VedicVN 2026, All rights reserved</Text>
    </View>
  );
};
