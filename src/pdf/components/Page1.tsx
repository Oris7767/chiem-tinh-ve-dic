/**
 * Page 1: LEFT (Chart + Planet Table) | RIGHT (DASA)
 */

import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { page1Styles, commonStyles, colors } from '../styles';
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

// Planet table column widths: HT(10%), Cung(10%), ViTri(15%), Nha(8%), Nakshatra(25%), ChuNha(15%), Pd(8%), Cd(9%)
const PLANET_COL_WIDTHS = {
  ht: '10%',
  cung: '10%',
  viTri: '15%',
  nha: '8%',
  nakshatra: '25%',
  chuNha: '15%',
  pd: '8%',
  cd: '9%',
};

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

// Get current index in antardashas based on currentAntardasha planet
function getCurrentAntarIndex(antardashas: any[], currentPlanet: string): number {
  if (!antardashas || antardashas.length === 0) return 0;
  const idx = antardashas.findIndex(a => a.planet === currentPlanet);
  return idx >= 0 ? idx : 0;
}

// Get items from current position onwards
function getFutureItems<T extends { startDate?: string }>(items: T[], maxItems: number = 12): T[] {
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

// DEBUG: Log dasha data
function debugDashaData(dashas: any) {
  console.log('=== DASHA DEBUG ===');
  console.log('current:', dashas?.current ? {
    planet: dashas.current.planet,
    hasAntardashas: !!dashas.current.antardashas,
    antardashasCount: dashas.current.antardashas?.length,
    hasCurrentAntar: !!dashas.current.currentAntardasha,
    currentAntarPlanet: dashas.current.currentAntardasha?.planet
  } : 'null');
  console.log('sequence length:', dashas?.sequence?.length);
  console.log('===================');
}

// Get 9 Antardashas starting from current position
function getAntarDashas(current: any, sequence: any[]): Array<{ planet: string; startDate: string; endDate: string }> {
  if (!current?.antardashas || current.antardashas.length === 0) return [];

  const result: Array<{ planet: string; startDate: string; endDate: string }> = [];
  const startIdx = getCurrentAntarIndex(current.antardashas, current.currentAntardasha?.planet || '');

  // Get from current antardashas
  for (let i = startIdx; i < current.antardashas.length && result.length < 9; i++) {
    const a = current.antardashas[i];
    result.push({ planet: a.planet, startDate: a.startDate, endDate: a.endDate });
  }

  // If not enough, get from next maha dashas
  if (result.length < 9 && sequence) {
    const currentMahaIdx = sequence.findIndex(s => s.planet === current.planet);
    for (let j = currentMahaIdx + 1; j < sequence.length && result.length < 9; j++) {
      const nextMaha = sequence[j];
      if (nextMaha.antardashas) {
        for (const a of nextMaha.antardashas) {
          result.push({ planet: a.planet, startDate: a.startDate, endDate: a.endDate });
          if (result.length >= 9) break;
        }
      }
      if (result.length >= 9) break;
    }
  }

  return result.slice(0, 9);
}

// Get 9 Pratyantars starting from current position
function getPratyantarDashas(current: any): Array<{ planet: string; startDate: string; endDate: string }> {
  // First try from currentAntardasha.pratyantars
  if (current?.currentAntardasha?.pratyantars && current.currentAntardasha.pratyantars.length > 0) {
    const result: Array<{ planet: string; startDate: string; endDate: string }> = [];
    const startIdx = getCurrentAntarIndex(current.currentAntardasha.pratyantars, current.currentPratyantar?.planet || '');
    
    for (let i = startIdx; i < current.currentAntardasha.pratyantars.length && result.length < 9; i++) {
      const p = current.currentAntardasha.pratyantars[i];
      result.push({ planet: p.planet, startDate: p.startDate, endDate: p.endDate });
    }
    return result.slice(0, 9);
  }
  
  // Fallback: try to get from first antardasha's pratyantars
  if (current?.antardashas?.[0]?.pratyantars && current.antardashas[0].pratyantars.length > 0) {
    return current.antardashas[0].pratyantars.slice(0, 9).map((p: any) => ({
      planet: p.planet,
      startDate: p.startDate,
      endDate: p.endDate
    }));
  }
  
  // Fallback: return empty but log
  console.log('WARN: No pratyantars data found in current antardasha');
  return [];
}

// Header
const Header: React.FC<{ data: PdfReportData }> = ({ data }) => (
  <View style={commonStyles.header}>
    <Text style={commonStyles.headerTitle}>LÁ SỐ CHIÊM TINH VỆ ĐÀ</Text>
    <Text style={commonStyles.headerSubtitle}>
      {data.birthData?.name || 'Unknown'} - {data.birthData?.birthDate || ''} {data.birthData?.birthTime || ''} - {data.birthData?.location || ''}
    </Text>
  </View>
);

// Main Chart
const MainChart: React.FC<{ image?: string }> = ({ image }) => (
  <View style={page1Styles.chartSection}>
    {image ? (
      <Image src={image} style={page1Styles.chartImage} />
    ) : (
      <Text style={{ color: colors.textLight, fontFamily: 'Roboto', fontSize: 8 }}>Dang tai bieu do...</Text>
    )}
  </View>
);

// Current Dasha Info
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
        Qua: {current.elapsed?.years || 0}y {current.elapsed?.months || 0}m | Con: {current.remaining?.years || 0}y {current.remaining?.months || 0}m
      </Text>
      {current.currentAntardasha && (
        <Text style={page1Styles.currentDashaDate}>
          Ant: {getPlanetName(current.currentAntardasha.planet)} ({formatDate(current.currentAntardasha.startDate)})
        </Text>
      )}
      {current.currentPratyantar && (
        <Text style={page1Styles.currentDashaDate}>
          Praty: {getPlanetName(current.currentPratyantar.planet)} ({formatDate(current.currentPratyantar.startDate)})
        </Text>
      )}
    </View>
  );
};

// DASA Table - Planet | StartDate - EndDate
const DasaTable: React.FC<{
  title: string;
  items: Array<{ planet: string; startDate: string; endDate?: string }>;
}> = ({ title, items }) => (
  <View style={page1Styles.dasaTable}>
    <View style={page1Styles.dasaTableHeader}>
      <Text style={page1Styles.dasaTableTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <View key={index} style={[
        page1Styles.dasaRow,
        index % 2 === 1 && { backgroundColor: colors.creamLight }
      ]}>
        <Text style={page1Styles.dasaText}>{getPlanetName(item.planet)}</Text>
        <Text style={page1Styles.dasaText}>
          {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : '-'}
        </Text>
      </View>
    ))}
  </View>
);

// Planet Table with specific % widths
const PlanetaryTable: React.FC<{ data: PdfReportData }> = ({ data }) => (
  <View style={page1Styles.planetarySection}>
    <View style={page1Styles.planetaryHeader}>
      <Text style={page1Styles.planetaryTitle}>CHI TIẾT CÁC HÀNH TINH</Text>
    </View>
    <View style={page1Styles.planetaryTableHeader}>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.ht }]}>HT</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.cung }]}>Cung</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.viTri }]}>Vi Tri</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.nha }]}>Nha</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.nakshatra }]}>Nakshatra</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.chuNha }]}>Chu Nha</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.pd }]}>Pd</Text>
      <Text style={[page1Styles.planetaryTableHeaderText, { width: PLANET_COL_WIDTHS.cd }]}>Cd</Text>
    </View>
    {data.chartData.planets.map((planet, index) => (
      <View key={planet.id} style={[
        page1Styles.planetaryTableRow,
        index % 2 === 1 && { backgroundColor: colors.creamLight }
      ]}>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.ht }]}>{PLANET_SHORT[planet.name] || planet.name}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.cung }]}>{ZODIAC_SHORT[planet.sign]}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.viTri }]}>{formatDegree(planet.longitude)}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.nha }]}>{planet.house}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.nakshatra }]}>{planet.nakshatra.name}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.chuNha }]}>{planet.nakshatra.lord}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.pd }]}>{planet.nakshatra.pada}</Text>
        <Text style={[page1Styles.planetaryTableCell, { width: PLANET_COL_WIDTHS.cd }]}>
          {planet.retrograde ? 'Ngh' : 'Thu'}
        </Text>
      </View>
    ))}
  </View>
);

// Main Page 1
export const Page1: React.FC<Page1Props> = ({ data }) => {
  const dashas = data.chartData.dashas;
  const sequence = dashas?.sequence || [];
  const current = dashas?.current;

  // DEBUG
  debugDashaData(dashas);

  // Maha Dasa - 12 items
  const mahaDashas = getFutureItems(
    sequence.map(d => ({
      planet: d.planet,
      startDate: d.startDate,
      endDate: d.endDate
    })),
    12
  );

  // Antar Dasa - 9 items starting from current
  const antarDashas = getAntarDashas(current, sequence);
  console.log('antarDashas result:', antarDashas);

  // Pratyantar Dasa - 9 items starting from current
  const pratyantarDashas = getPratyantarDashas(current);
  console.log('pratyantarDashas result:', pratyantarDashas);

  return (
    <View style={page1Styles.container}>
      <Header data={data} />

      {/* Main Layout: LEFT 65% | RIGHT 33% */}
      <View style={page1Styles.mainLayout}>

        {/* LEFT Column: Chart + Planet Table */}
        <View style={page1Styles.leftColumn}>
          <MainChart image={data.mainChartImage} />
          <PlanetaryTable data={data} />
        </View>

        {/* RIGHT Column: All DASA tables */}
        <View style={page1Styles.rightColumn}>
          <CurrentDasha data={data} />
          <DasaTable title="VIMSHOTTARI ĐẠI VẬN" items={mahaDashas} />
          <DasaTable title="ANTAR VẬN" items={antarDashas} />
          <DasaTable title="PRATYANTAR VẬN" items={pratyantarDashas} />
        </View>

      </View>

      {/* Footer */}
      <Text style={commonStyles.footer}>Được tạo bởi Votive VedicVN 2026, Mọi quyền được bảo lưu</Text>
    </View>
  );
};
