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
  'Sun': 'Mặt Trời', 'Moon': 'Mặt Trăng', 'Mars': 'Sao Hỏa',
  'Mercury': 'Sao Thủy', 'Jupiter': 'Sao Mộc', 'Venus': 'Sao Kim',
  'Saturn': 'Sao Thổ', 'Rahu': 'Sao Rahu', 'Ketu': 'Sao Ketu',
  'Uranus': 'Thiên Vương', 'Neptune': 'Hải Vương', 'Pluto': 'Diêm Vương'
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

// Find current antar and pratyantar based on current date
function getCurrentAntarAndPratyantar(antardashas: any[]): { currentAntar: any; currentPratyantar: any } | null {
  if (!antardashas || antardashas.length === 0) return null;
  
  const now = new Date();
  
  // Find current antar
  let currentAntar = null;
  for (const antar of antardashas) {
    const startDate = new Date(antar.startDate);
    const endDate = new Date(antar.endDate);
    if (startDate <= now && now <= endDate) {
      currentAntar = antar;
      break;
    }
  }
  
  // If no current antar found, the current antar is the first one if now is before its start
  if (!currentAntar && new Date(antardashas[0].startDate) > now) {
    currentAntar = antardashas[0];
  }
  
  if (!currentAntar) return null;
  
  // Find current pratyantar within current antar
  let currentPratyantar = null;
  const pratyantars = currentAntar.pratyantars || [];
  for (const pratyantar of pratyantars) {
    const startDate = new Date(pratyantar.startDate);
    const endDate = new Date(pratyantar.endDate);
    if (startDate <= now && now <= endDate) {
      currentPratyantar = pratyantar;
      break;
    }
  }
  
  // If no current pratyantar found
  if (!currentPratyantar && pratyantars.length > 0) {
    currentPratyantar = pratyantars[0];
  }
  
  return { currentAntar, currentPratyantar };
}

// Get 9 Antardashas starting from current position
function getAntarDashas(currentAntardasha: any, antardashas: any[]): Array<{ planet: string; startDate: string; endDate: string }> {
  if (!currentAntardasha || !antardashas || antardashas.length === 0) {
    console.log('WARN: No current antardasha or antardashas array');
    return [];
  }

  const result: Array<{ planet: string; startDate: string; endDate: string }> = [];
  const currentAntarPlanet = currentAntardasha.planet;
  
  // Find current antar index
  let startIdx = antardashas.findIndex((a: any) => a.planet === currentAntarPlanet);
  if (startIdx < 0) startIdx = 0;
  
  // Get 9 antardashas from current position
  for (let i = startIdx; i < antardashas.length && result.length < 9; i++) {
    const a = antardashas[i];
    result.push({ planet: a.planet, startDate: a.startDate, endDate: a.endDate });
  }
  
  // If still need more, wrap around to beginning
  if (result.length < 9) {
    for (let i = 0; i < startIdx && result.length < 9; i++) {
      const a = antardashas[i];
      result.push({ planet: a.planet, startDate: a.startDate, endDate: a.endDate });
    }
  }

  console.log('antarDashas result:', result.length, 'items');
  return result;
}

// Get 9 Pratyantars starting from current position
function getPratyantarDashas(currentPratyantar: any, antardashas: any[]): Array<{ planet: string; startDate: string; endDate: string }> {
  if (!currentPratyantar || !antardashas || antardashas.length === 0) {
    console.log('WARN: No current pratyantar or antardashas array');
    return [];
  }

  const result: Array<{ planet: string; startDate: string; endDate: string }> = [];
  const currentPratPlanet = currentPratyantar.planet;
  
  // Find current antar index
  let antarIdx = antardashas.findIndex((a: any) => {
    const startDate = new Date(a.startDate);
    const endDate = new Date(a.endDate);
    const now = new Date();
    return startDate <= now && now <= endDate;
  });
  
  if (antarIdx < 0) antarIdx = 0;
  
  const currentAntarPlanet = antardashas[antarIdx].planet;
  const currentAntarPlanetFromPrat = currentPratyantar.planet;
  
  // Collect 9 pratyantars from current position
  let remainingCount = 9;
  let foundCurrent = false;
  
  while (remainingCount > 0) {
    const antar = antardashas[antarIdx % antardashas.length];
    const pratyantars = antar.pratyantars || [];
    
    for (let i = 0; i < pratyantars.length && remainingCount > 0; i++) {
      const p = pratyantars[i];
      
      if (!foundCurrent && p.planet === currentPratPlanet) {
        foundCurrent = true;
      }
      
      if (foundCurrent) {
        result.push({ planet: p.planet, startDate: p.startDate, endDate: p.endDate });
        remainingCount--;
      }
    }
    
    // If we haven't found the current pratyantar yet, continue searching
    if (!foundCurrent) {
      antarIdx++;
    } else {
      // We found it and collected some, now just continue with remaining antars
      antarIdx++;
      if (antarIdx >= antardashas.length && !foundCurrent) {
        // Wrap around
        antarIdx = 0;
      }
    }
    
    // Safety break to prevent infinite loop
    if (result.length === 0 && antarIdx > antardashas.length) break;
  }

  console.log('pratyantarDashas result:', result.length, 'items');
  return result;
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
          {planet.retrograde ? 'R' : ''}
        </Text>
      </View>
    ))}
  </View>
);

// Main Page 1
export const Page1: React.FC<Page1Props> = ({ data }) => {
  const dashas = data.chartData.dashas;
  const current = dashas?.current;
  const antardashas = current?.antardashas || [];

  // Find current antar and pratyantar based on date
  const { currentAntar, currentPratyantar } = getCurrentAntarAndPratyantar(antardashas) || { currentAntar: null, currentPratyantar: null };
  
  console.log('=== DASHA CALC ===');
  console.log('currentAntar:', currentAntar?.planet);
  console.log('currentPratyantar:', currentPratyantar?.planet);
  console.log('====================');

  // Maha Dasa - 12 items
  const mahaDashas = getFutureItems(
    dashas?.sequence?.map((d: any) => ({
      planet: d.planet,
      startDate: d.startDate,
      endDate: d.endDate
    })) || [],
    12
  );

  // Antar Dasa - 9 items starting from current
  const antarDashas = getAntarDashas(currentAntar, antardashas);
  console.log('antarDashas result:', antarDashas);

  // Pratyantar Dasa - 9 items starting from current
  const pratyantarDashas = getPratyantarDashas(currentPratyantar, antardashas);
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
