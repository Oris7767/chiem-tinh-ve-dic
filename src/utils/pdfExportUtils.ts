import { LOGO_DATA_URL } from './logoDataUrl';
import { calculateAllVargas, PlanetInput, VargaCharts } from './vargaCalculations';

// Types
export interface NakshatraInfo {
  name: string;
  lord: string;
  startDegree: number;
  endDegree: number;
  pada: number;
}

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  longitudeSpeed: number;
  sign: number;
  house: number;
  retrograde: boolean;
  color: string;
  nakshatra: NakshatraInfo;
}

export interface House {
  number: number;
  longitude: number;
  sign: number;
  planets: string[];
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed?: {
    years: number;
    months: number;
    days: number;
  };
  remaining?: {
    years: number;
    months: number;
    days: number;
  };
  antardasha?: {
    current?: {
      planet: string;
      startDate: string;
      endDate: string;
      elapsed: { years: number; months: number; days: number };
      remaining: { years: number; months: number; days: number };
    };
    sequence: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      pratyantardasha?: Array<{
        planet: string;
        startDate: string;
        endDate: string;
      }>;
    }>;
  };
}

export interface VedicChartData {
  ascendant: number;
  ascendantNakshatra: NakshatraInfo;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
  dashas?: {
    current: DashaPeriod;
    sequence: DashaPeriod[];
  };
}

export interface BirthDataFormValues {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
}

// Constants
const ZODIAC_SIGNS_VI = [
  "Bach Duong", "Kim Nguu", "Song Tu", "Cu Giai", "Su Tu", "Xu Nu",
  "Thien Binh", "Bo Cap", "Nhan Ma", "Ma Ket", "Bao Binh", "Song Ngu"
];

const ZODIAC_SIGNS_SHORT = [
  "Ar", "Ta", "Ge", "Ca", "Le", "Vi",
  "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
];

// Planet names - ASCII safe for PDF
const PLANET_NAMES_ASCII: Record<string, string> = {
  'Sun': 'Mat Troi', 'Moon': 'Mat Trang', 'Mars': 'Sao Hoa',
  'Mercury': 'Sao Thuy', 'Jupiter': 'Sao Moc', 'Venus': 'Sao Kim',
  'Saturn': 'Sao Tho', 'Rahu': 'Sao Rahu', 'Ketu': 'Sao Ketu',
  'Uranus': 'Sao Thien Vuong', 'Neptune': 'Sao Hai Vuong', 'Pluto': 'Sao Diem Vuong'
};

// Planet short names
const PLANET_SHORT_NAMES: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

// 16 Vargas
const VARGAS_DATA = [
  { id: 'D1', name: 'Rasi', key: 'D1' as const },
  { id: 'D2', name: 'Hora', key: 'D2' as const },
  { id: 'D3', name: 'Drekkana', key: 'D3' as const },
  { id: 'D4', name: 'Chaturamsa', key: 'D4' as const },
  { id: 'D7', name: 'Saptamsa', key: 'D7' as const },
  { id: 'D9', name: 'Navamsa', key: 'D9' as const },
  { id: 'D10', name: 'Dasamsa', key: 'D10' as const },
  { id: 'D12', name: 'Dwadamsa', key: 'D12' as const },
  { id: 'D16', name: 'Shodasamsa', key: 'D16' as const },
  { id: 'D20', name: 'Vimsamsa', key: 'D20' as const },
  { id: 'D24', name: 'Siddhamsa', key: 'D24' as const },
  { id: 'D27', name: 'Nakshatramsa', key: 'D27' as const },
  { id: 'D30', name: 'Trimsamsa', key: 'D30' as const },
  { id: 'D40', name: 'Khavedamsa', key: 'D40' as const },
  { id: 'D45', name: 'Akshvedamsa', key: 'D45' as const },
  { id: 'D60', name: 'Shashtiamsa', key: 'D60' as const },
];

// Helper functions
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

function getPlanetShort(name: string): string {
  return PLANET_SHORT_NAMES[name] || name.substring(0, 2);
}

function getPlanetName(name: string): string {
  return PLANET_NAMES_ASCII[name] || name;
}

// Generate SVG for South Indian Chart
function generateSouthIndianChartSVG(
  chartData: VedicChartData,
  width: number = 500,
  height: number = 500,
  showCoords: boolean = true
): string {
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Map planets to houses
  const planetsByHouse = chartData.planets.reduce((acc: Record<number, Planet[]>, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) acc[houseNumber] = [];
    acc[houseNumber].push(planet);
    return acc;
  }, {});

  // Calculate ascendant sign
  const ascSign = Math.floor(chartData.ascendant / 30);
  const getHouseNumber = (signIndex: number) => ((signIndex - ascSign + 12) % 12) + 1;

  // Grid settings
  const gridSize = 100;
  const offsetX = 50;
  const offsetY = 70;
  const scale = width / 500;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect x="0" y="0" width="${width}" height="${height}" fill="white"/>
    <g transform="translate(${offsetX * scale}, ${offsetY * scale})">`;

  // Draw grid cells
  for (let index = 0; index < 12; index++) {
    const [row, col] = positions[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];
    const isAscendant = houseNumber === 1;

    const x = col * gridSize * scale;
    const y = row * gridSize * scale;
    const cellSize = gridSize * scale;

    // Cell border
    svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="none" stroke="#B45309" stroke-width="1"/>`;

    // Sign and house number
    svg += `<text x="${x + 5 * scale}" y="${y + 15 * scale}" font-size="${10 * scale}" fill="#B45309" font-weight="bold">${ZODIAC_SIGNS_SHORT[signIndex]} ${houseNumber}</text>`;

    // ASC coordinates
    if (isAscendant) {
      svg += `<text x="${x + 5 * scale}" y="${y + 28 * scale}" font-size="${8 * scale}" fill="#B45309">ASC ${formatDegree(chartData.ascendant)}</text>`;
    }

    // Planets - use short names
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + (42 + idx * 12) * scale;
      const suffix = planet.retrograde ? 'R' : '';
      const degreeText = showCoords ? ` ${formatDegree(planet.longitude)}` : '';
      svg += `<text x="${x + 5 * scale}" y="${planetY}" font-size="${8 * scale}" fill="#000000">${getPlanetShort(planet.name)}${suffix}${degreeText}</text>`;
    });
  }

  // Center logo
  const logoSize = 100 * scale;
  const logoX = 150 * scale;
  const logoY = 150 * scale;
  svg += `<image href="${LOGO_DATA_URL}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}"/>`;

  svg += '</g></svg>';
  return svg;
}

// Generate mini South Indian Chart SVG for Vargas
function generateMiniChartSVG(
  vargaData: { planets: Array<{ id: string; name: string; house: number; vargaDegree: number; retrograde: boolean }>; ascendantSign: number },
  width: number = 350,
  height: number = 350
): string {
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Map planets to houses
  const planetsByHouse = vargaData.planets.reduce((acc: Record<number, typeof vargaData.planets>, planet) => {
    if (!acc[planet.house]) acc[planet.house] = [];
    acc[planet.house].push(planet);
    return acc;
  }, {});

  const getHouseNumber = (signIndex: number) => ((signIndex - vargaData.ascendantSign + 12) % 12) + 1;

  const gridSize = 70;
  const offsetX = 25;
  const offsetY = 35;
  const scale = width / 350;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect x="0" y="0" width="${width}" height="${height}" fill="white"/>
    <g transform="translate(${offsetX * scale}, ${offsetY * scale})">`;

  for (let index = 0; index < 12; index++) {
    const [row, col] = positions[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];

    const x = col * gridSize * scale;
    const y = row * gridSize * scale;
    const cellSize = gridSize * scale;

    svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="none" stroke="#B45309" stroke-width="0.5"/>`;
    svg += `<text x="${x + 3 * scale}" y="${y + 12 * scale}" font-size="${8 * scale}" fill="#B45309">${ZODIAC_SIGNS_SHORT[signIndex]} ${houseNumber}</text>`;

    // Planets with degree - use short names
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + (24 + idx * 11) * scale;
      const suffix = planet.retrograde ? 'R' : '';
      const degreeText = formatDegree(planet.vargaDegree || 0);
      svg += `<text x="${x + 3 * scale}" y="${planetY}" font-size="${7 * scale}" fill="#000000">${getPlanetShort(planet.name)}${suffix} <tspan font-size="5" fill="#666">${degreeText}</tspan></text>`;
    });
  }

  svg += '</g></svg>';
  return svg;
}

// SVG to Canvas converter
async function svgToCanvas(svgString: string, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    const img = new Image();
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };

    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.crossOrigin = 'anonymous';
    img.src = svgUrl;
  });
}

// Main PDF Export Function
export async function exportVedicChartPDF(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  // Dynamic import for jsPDF
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jsPDFClass = (await import('jspdf')).default;

  // Create PDF with A4 size
  const pdf: any = new jsPDFClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  // === PAGE 1: Overview & Dasa System ===

  // Header Background
  pdf.setFillColor(180, 83, 9); // votive-red
  pdf.rect(0, 0, pageWidth, 22, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LA SO CHIEM TINH VE DA', pageWidth / 2, 9, { align: 'center' });

  // User info
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  if (userData) {
    const birthInfo = `${userData.name || 'Khong ten'} - ${userData.birthDate || ''} ${userData.birthTime || ''} - ${userData.location || ''}`;
    pdf.text(birthInfo, pageWidth / 2, 16, { align: 'center' });
  }

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Top Section: Grid Layout (2 columns)
  const topSectionY = 27;
  const chartWidth = contentWidth * 0.62; // 2/3 width
  const dasaWidth = contentWidth * 0.38; // 1/3 width
  const dasaX = margin + chartWidth + 3;

  // === LEFT: South Indian Chart ===
  const chartSvg = generateSouthIndianChartSVG(chartData, 500, 500, true);
  const chartCanvas = await svgToCanvas(chartSvg, 500, 500);
  const chartImgData = chartCanvas.toDataURL('image/png', 1.0);

  // Calculate chart size to fit in the allocated space
  const chartHeightMM = chartWidth; // Keep aspect ratio 1:1
  pdf.addImage(chartImgData, 'PNG', margin, topSectionY, chartWidth, chartHeightMM);

  // === RIGHT: Dasa System (Flat List) ===
  let dasaY = topSectionY + 2;

  // Current Dasha Header
  pdf.setFillColor(255, 250, 240);
  pdf.rect(dasaX, dasaY, dasaWidth - 3, 20, 'F');

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('DAI VAN HIEN TAI', dasaX + 2, dasaY + 4);

  if (chartData.dashas?.current) {
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(getPlanetName(chartData.dashas.current.planet), dasaX + 2, dasaY + 9);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, dasaX + 2, dasaY + 13);

    pdf.text(`Qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m`, dasaX + 2, dasaY + 17);
    pdf.text(`Con: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m`, dasaX + dasaWidth - 25, dasaY + 17);
  }

  dasaY += 23;

  // === Maha Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(dasaX, dasaY, dasaWidth - 3, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VIMSHOTTARI MAHA DASA', dasaX + 2, dasaY + 3.5);
  dasaY += 7;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STT', dasaX + 2, dasaY);
  pdf.text('Hanh Tinh', dasaX + 10, dasaY);
  pdf.text('Bat Dau', dasaX + 38, dasaY);
  dasaY += 4;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  if (chartData.dashas?.sequence) {
    chartData.dashas.sequence.forEach((dasha, index) => {
      if (dasaY > pageHeight - 50) return;
      pdf.setFontSize(5);
      pdf.text(`${index + 1}`, dasaX + 2, dasaY);
      pdf.text(getPlanetName(dasha.planet), dasaX + 10, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), dasaX + 38, dasaY);
      dasaY += 3.5;
    });
  }

  dasaY += 3;

  // === Antar Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(dasaX, dasaY, dasaWidth - 3, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ANTAR DASA (TIEU VAN)', dasaX + 2, dasaY + 3.5);
  dasaY += 7;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hanh Tinh', dasaX + 2, dasaY);
  pdf.text('Bat Dau', dasaX + 25, dasaY);
  dasaY += 4;

  // Table rows - Flat list of ALL antardashas
  pdf.setFont('helvetica', 'normal');
  const antardashaSequence = chartData.dashas?.current?.antardasha?.sequence || [];
  antardashaSequence.forEach((dasha) => {
    if (dasaY > pageHeight - 50) return;
    pdf.setFontSize(5);
    pdf.text(getPlanetName(dasha.planet), dasaX + 2, dasaY);
    pdf.text(formatDate(dasha.startDate).substring(0, 10), dasaX + 25, dasaY);
    dasaY += 3.5;
  });

  dasaY += 3;

  // === Pratyantar Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(dasaX, dasaY, dasaWidth - 3, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRATYANTAR DASA (PHAN VAN)', dasaX + 2, dasaY + 3.5);
  dasaY += 7;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hanh Tinh', dasaX + 2, dasaY);
  pdf.text('Bat Dau', dasaX + 25, dasaY);
  dasaY += 4;

  // Table rows - ALL pratyantardashas of current antardasha
  pdf.setFont('helvetica', 'normal');
  const currentAntardasha = antardashaSequence[0]; // Current antardasha
  if (currentAntardasha?.pratyantardasha && currentAntardasha.pratyantardasha.length > 0) {
    currentAntardasha.pratyantardasha.forEach((dasha) => {
      if (dasaY > pageHeight - 50) return;
      pdf.setFontSize(5);
      pdf.text(getPlanetName(dasha.planet), dasaX + 2, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), dasaX + 25, dasaY);
      dasaY += 3.5;
    });
  } else {
    // If no pratyantardasha data, show message
    pdf.setFontSize(5);
    pdf.setTextColor(128, 128, 128);
    pdf.text('(Dang tinh toan...)', dasaX + 2, dasaY);
    dasaY += 3.5;
  }

  // === Bottom Section: Planetary Details Table ===
  // Add gap between Dasa section and Planet Details
  const planetTableY = topSectionY + chartHeightMM + 6;

  // Section Header
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin, planetTableY, contentWidth, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHI TIET CAC HANH TINH (GRAHA)', pageWidth / 2, planetTableY + 4, { align: 'center' });

  let tableY = planetTableY + 9;

  // Table header - 8 columns
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  const colWidths = [22, 12, 30, 12, 28, 20, 10, 20];
  const cols = ['Hanh Tinh', 'Cung', 'Vi tri', 'Nha', 'Nakshatra', 'Chu Nha', 'Pada', 'Chuyen Dong'];
  let colX = margin;
  cols.forEach((header, i) => {
    pdf.text(header, colX, tableY);
    colX += colWidths[i];
  });

  tableY += 4;
  pdf.setDrawColor(180, 83, 9);
  pdf.line(margin, tableY - 1, margin + contentWidth, tableY - 1);

  // Table rows
  pdf.setFont('helvetica', 'normal');
  chartData.planets.forEach((planet) => {
    if (tableY > pageHeight - 15) return;

    pdf.setFontSize(6);
    colX = margin;

    // Planet name - use short name
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${getPlanetShort(planet.name)} ${planet.name}`, colX, tableY);
    colX += colWidths[0];

    // Zodiac sign
    pdf.setFont('helvetica', 'normal');
    pdf.text(ZODIAC_SIGNS_SHORT[planet.sign], colX, tableY);
    colX += colWidths[1];

    // Position (degree)
    pdf.text(formatDegree(planet.longitude), colX, tableY);
    colX += colWidths[2];

    // House
    pdf.text(`${planet.house}`, colX, tableY);
    colX += colWidths[3];

    // Nakshatra (separated from Lord)
    pdf.text(planet.nakshatra.name, colX, tableY);
    colX += colWidths[4];

    // Lord (separate column)
    pdf.text(planet.nakshatra.lord, colX, tableY);
    colX += colWidths[5];

    // Pada
    pdf.text(`${planet.nakshatra.pada}`, colX, tableY);
    colX += colWidths[6];

    // Motion
    pdf.setTextColor(planet.retrograde ? 200 : 0, planet.retrograde ? 0 : 100, planet.retrograde ? 0 : 0);
    pdf.text(planet.retrograde ? 'Nghich' : 'Thuan', colX, tableY);
    pdf.setTextColor(0, 0, 0);

    tableY += 4.5;
  });

  // === PAGE 2: 16 D-Varga Charts ===
  pdf.addPage();

  // Header
  pdf.setFillColor(180, 83, 9);
  pdf.rect(0, 0, pageWidth, 16, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HE THONG 16 D-VARGA (PHAN CUNG)', pageWidth / 2, 7, { align: 'center' });
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Theo he thong Parashara - Divisional Charts', pageWidth / 2, 12, { align: 'center' });

  // Calculate Varga charts
  const planetsInput: PlanetInput[] = chartData.planets.map(planet => ({
    id: planet.id,
    name: planet.name,
    longitude: parseFloat(String(planet.longitude)) || 0,
    house: planet.house,
    sign: planet.sign,
    retrograde: planet.retrograde,
  }));

  const vargaCharts: VargaCharts = calculateAllVargas(
    planetsInput,
    parseFloat(String(chartData.ascendant)) || 0
  );

  // Grid layout: 4 columns x 4 rows
  const gridStartY = 20;
  const gridCols = 4;
  const gridRows = 4;
  const availableWidth = contentWidth - 6; // Account for gaps
  const availableHeight = pageHeight - gridStartY - 12;
  const cellWidth = availableWidth / gridCols;
  const cellHeight = availableHeight / gridRows;
  const miniChartSize = Math.min(cellWidth, cellHeight) - 2;

  for (let i = 0; i < VARGAS_DATA.length; i++) {
    const varga = VARGAS_DATA[i];
    const vargaData = vargaCharts[varga.key];

    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    // Center the chart in its cell
    const cellCenterX = margin + 3 + col * cellWidth + cellWidth / 2;
    const cellCenterY = gridStartY + row * cellHeight + cellHeight / 2;
    const chartX = cellCenterX - miniChartSize / 2;
    const chartY = cellCenterY - miniChartSize / 2;

    // Chart background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(180, 83, 9);
    pdf.roundedRect(chartX, chartY, miniChartSize, miniChartSize, 1, 1, 'FD');

    // Title - ensure D7 shows as "D7" not "07"
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(180, 83, 9);
    const titleText = `${varga.id} - ${varga.name}`;
    pdf.text(titleText, cellCenterX, chartY + 3, { align: 'center' });

    // Generate mini chart SVG
    const miniSvg = generateMiniChartSVG(vargaData, 350, 350);
    const miniCanvas = await svgToCanvas(miniSvg, 350, 350);
    const miniImgData = miniCanvas.toDataURL('image/png', 1.0);

    // Draw mini chart with padding
    const chartPadding = 3;
    pdf.addImage(miniImgData, 'PNG', chartX + chartPadding, chartY + 5, miniChartSize - chartPadding * 2, miniChartSize - 8);
  }

  // Footer
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.text('ChiEm Tinh Ve Da - Vedic Astrology', pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Save the PDF
  const fileName = userData?.name
    ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.pdf`
    : 'vedic-birth-chart.pdf';

  pdf.save(fileName);
  console.log(`PDF exported successfully: ${fileName}`);
}

// Export as PNG (alternative)
export async function exportVedicChartPNG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  const chartSvg = generateSouthIndianChartSVG(chartData, 1000, 1000, true);
  const chartCanvas = await svgToCanvas(chartSvg, 1000, 1000);

  const link = document.createElement('a');
  link.download = userData?.name
    ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}.png`
    : 'vedic-birth-chart.png';
  link.href = chartCanvas.toDataURL('image/png', 1.0);
  link.click();
}

// Generate HTML for printing (with full Unicode support)
export function generatePrintableHTML(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): string {
  // Calculate vargas
  const planetsInput: PlanetInput[] = chartData.planets.map(planet => ({
    id: planet.id,
    name: planet.name,
    longitude: parseFloat(String(planet.longitude)) || 0,
    house: planet.house,
    sign: planet.sign,
    retrograde: planet.retrograde,
  }));

  const vargaCharts = calculateAllVargas(
    planetsInput,
    parseFloat(String(chartData.ascendant)) || 0
  );

  // Generate HTML with proper Vietnamese
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lá Số Chiêm Tinh Vệ Đà - ${userData?.name || 'Unknown'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .page-break { page-break-before: always; }
      .no-break { page-break-inside: avoid; }
    }
    .chart-container { width: 100%; max-width: 500px; }
    .mini-chart { width: 100%; max-width: 180px; }
    .votive-border { border-color: #B45309; }
    .votive-bg { background-color: #B45309; }
    .votive-text { color: #B45309; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; font-size: 10px; }
    th { background-color: #fef3c7; }
    .vargas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .varga-item { border: 1px solid #B45309; border-radius: 4px; padding: 4px; text-align: center; }
    .varga-title { font-size: 9px; font-weight: bold; color: #B45309; margin-bottom: 2px; }
  </style>
</head>
<body class="bg-white text-black p-4 font-sans">
  <!-- PAGE 1 -->
  <div class="max-w-[210mm] mx-auto">
    <!-- Header -->
    <div class="votive-bg text-white p-3 rounded-t-lg">
      <h1 class="text-xl font-bold text-center">LÁ SỐ CHIÊM TINH VỆ ĐÀ</h1>
      <p class="text-center text-sm">
        ${userData?.name || 'Không tên'} - ${userData?.birthDate || ''} ${userData?.birthTime || ''} - ${userData?.location || ''}
      </p>
    </div>

    <!-- Top Section: Grid -->
    <div class="flex mt-2 gap-2">
      <!-- Chart (larger) -->
      <div class="flex-[2]">
        <div class="border-2 border-votive-border rounded-lg p-2 flex justify-center">
          <div class="chart-container">
            ${generateSouthIndianChartSVG(chartData, 500, 500, true)}
          </div>
        </div>
      </div>

      <!-- Dasa System -->
      <div class="flex-[1] border-2 border-votive-border rounded-lg p-2">
        <!-- Current Dasha -->
        <div class="bg-amber-50 p-2 rounded mb-2">
          <h3 class="text-xs font-bold votive-text">ĐẠI VẬN HIỆN TẠI</h3>
          ${chartData.dashas?.current ? `
            <p class="font-bold text-sm">${PLANET_NAMES_ASCII[chartData.dashas.current.planet]}</p>
            <p class="text-xs">${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}</p>
            <p class="text-xs">Qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m</p>
            <p class="text-xs">Còn: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m</p>
          ` : '<p class="text-xs text-gray-500">(Không có dữ liệu)</p>'}
        </div>

        <!-- Maha Dasha -->
        <div class="mb-2">
          <h3 class="text-xs font-bold text-white bg-votive-bg p-1 rounded">VIMSHOTTARI MAHA DASA</h3>
          <table class="w-full text-xs mt-1">
            <thead>
              <tr class="bg-amber-100">
                <th class="p-1">STT</th>
                <th class="p-1">Hành Tinh</th>
                <th class="p-1">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.sequence || []).map((d, i) => `
                <tr>
                  <td class="p-1">${i + 1}</td>
                  <td class="p-1 font-medium">${PLANET_NAMES_ASCII[d.planet]}</td>
                  <td class="p-1">${formatDate(d.startDate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Antar Dasha -->
        <div class="mb-2">
          <h3 class="text-xs font-bold text-white bg-votive-bg p-1 rounded">ANTAR DASA</h3>
          <table class="w-full text-xs mt-1">
            <thead>
              <tr class="bg-amber-100">
                <th class="p-1">Hành Tinh</th>
                <th class="p-1">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.current?.antardasha?.sequence || []).map(d => `
                <tr>
                  <td class="p-1 font-medium">${PLANET_NAMES_ASCII[d.planet]}</td>
                  <td class="p-1">${formatDate(d.startDate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pratyantar Dasha -->
        <div>
          <h3 class="text-xs font-bold text-white bg-votive-bg p-1 rounded">PRATYANTAR DASA</h3>
          <table class="w-full text-xs mt-1">
            <thead>
              <tr class="bg-amber-100">
                <th class="p-1">Hành Tinh</th>
                <th class="p-1">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.current?.antardasha?.sequence[0]?.pratyantardasha || []).map(d => `
                <tr>
                  <td class="p-1 font-medium">${PLANET_NAMES_ASCII[d.planet]}</td>
                  <td class="p-1">${formatDate(d.startDate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Planetary Details -->
    <div class="mt-4 border-2 border-votive-border rounded-lg overflow-hidden">
      <div class="votive-bg text-white p-2">
        <h2 class="text-sm font-bold text-center">CHI TIẾT CÁC HÀNH TINH (GRAHA)</h2>
      </div>
      <table class="w-full text-xs">
        <thead class="bg-amber-100">
          <tr>
            <th class="p-2">Hành Tinh</th>
            <th class="p-2">Cung</th>
            <th class="p-2">Vị trí</th>
            <th class="p-2">Nhà</th>
            <th class="p-2">Nakshatra</th>
            <th class="p-2">Chủ Nhà</th>
            <th class="p-2">Pada</th>
            <th class="p-2">Chuyển động</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.planets.map(p => `
            <tr class="hover:bg-amber-50">
              <td class="p-2 font-bold">${getPlanetShort(p.name)} ${PLANET_NAMES_ASCII[p.name]}</td>
              <td class="p-2">${ZODIAC_SIGNS_VI[p.sign]}</td>
              <td class="p-2">${formatDegree(p.longitude)}</td>
              <td class="p-2">${p.house}</td>
              <td class="p-2">${p.nakshatra.name}</td>
              <td class="p-2">${p.nakshatra.lord}</td>
              <td class="p-2">${p.nakshatra.pada}</td>
              <td class="p-2 ${p.retrograde ? 'text-red-600' : 'text-green-600'}">${p.retrograde ? 'Nghịch' : 'Thuận'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- PAGE 2: 16 Vargas -->
    <div class="page-break"></div>

    <!-- Vargas Header -->
    <div class="votive-bg text-white p-3 rounded-t-lg mt-4">
      <h1 class="text-lg font-bold text-center">HỆ THỐNG 16 D-VARGA (PHÂN CUNG)</h1>
      <p class="text-center text-xs">Theo hệ thống Parashara - Divisional Charts</p>
    </div>

    <!-- Vargas Grid -->
    <div class="vargas-grid border-2 border-votive-border rounded-b-lg p-2">
      ${VARGAS_DATA.map(varga => {
        const vargaData = vargaCharts[varga.key];
        return `
          <div class="varga-item">
            <div class="varga-title">${varga.id} - ${varga.name}</div>
            <div class="mini-chart">
              ${generateMiniChartSVG(vargaData, 350, 350)}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Footer -->
    <div class="text-center text-gray-500 text-xs mt-4 py-2 border-t">
      Chiêm Tinh Vệ Đà - Vedic Astrology
    </div>
  </div>
</body>
</html>`;

  return html;
}

// Open printable page in new window
export function openPrintablePage(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): void {
  const html = generatePrintableHTML(chartData, userData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

// Print directly
export function printVedicChart(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): void {
  const html = generatePrintableHTML(chartData, userData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
