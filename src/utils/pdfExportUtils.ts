import { LOGO_DATA_URL } from './logoDataUrl';
import { calculateAllVargas, PlanetInput, VargaCharts } from './vargaCalculations';

// Types - Updated to match actual API response
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

// Updated Dasha structure to match API response
export interface CurrentAntardasha {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed: { years: number; months: number; days: number };
  remaining: { years: number; months: number; days: number };
  currentPratyantar?: {
    planet: string;
    startDate: string;
    endDate: string;
    elapsed: { years: number; months: number; days: number };
    remaining: { years: number; months: number; days: number };
    currentSookshma?: any;
  };
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed: { years: number; months: number; days: number };
  remaining: { years: number; months: number; days: number };
  currentAntardasha?: CurrentAntardasha;
  antardashas?: Array<{
    planet: string;
    startDate: string;
    endDate: string;
    duration: number;
    pratyantars?: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      duration: number;
    }>;
  }>;
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

// Generate SVG for South Indian Chart with HIGH RESOLUTION
function generateSouthIndianChartSVG(
  chartData: VedicChartData,
  size: number = 800, // Increased from 500
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

  // Grid settings - scaled to SVG size
  const gridSize = 160; // Increased cell size
  const offsetX = 80;
  const offsetY = 112;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
    <g transform="translate(${offsetX}, ${offsetY})">`;

  // Draw grid cells
  for (let index = 0; index < 12; index++) {
    const [row, col] = positions[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];
    const isAscendant = houseNumber === 1;

    const x = col * gridSize;
    const y = row * gridSize;

    // Cell border
    svg += `<rect x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" fill="none" stroke="#B45309" stroke-width="1.5"/>`;

    // Sign and house number
    svg += `<text x="${x + 8}" y="${y + 24}" font-size="16" fill="#B45309" font-weight="bold" font-family="Arial">${ZODIAC_SIGNS_SHORT[signIndex]} ${houseNumber}</text>`;

    // ASC coordinates
    if (isAscendant) {
      svg += `<text x="${x + 8}" y="${y + 45}" font-size="12" fill="#B45309" font-family="Arial">ASC ${formatDegree(chartData.ascendant)}</text>`;
    }

    // Planets - use short names
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + 65 + idx * 18;
      const suffix = planet.retrograde ? 'R' : '';
      const degreeText = showCoords ? ` ${formatDegree(planet.longitude)}` : '';
      svg += `<text x="${x + 8}" y="${planetY}" font-size="12" fill="#000000" font-family="Arial">${getPlanetShort(planet.name)}${suffix}${degreeText}</text>`;
    });
  }

  // Center logo
  const logoSize = 160;
  const logoX = 160;
  const logoY = 160;
  svg += `<image href="${LOGO_DATA_URL}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}"/>`;

  svg += '</g></svg>';
  return svg;
}

// Generate mini South Indian Chart SVG for Vargas - NO BORDERS, MAX SIZE
function generateMiniChartSVG(
  vargaData: { planets: Array<{ id: string; name: string; house: number; vargaDegree: number; retrograde: boolean }>; ascendantSign: number },
  size: number = 200
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

  // Scale grid to SVG size
  const gridSize = size / 4; // 4 rows
  const offsetX = gridSize * 0.7 / 2;
  const offsetY = gridSize * 1.0 / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
    <g transform="translate(${offsetX}, ${offsetY})">`;

  for (let index = 0; index < 12; index++) {
    const [row, col] = positions[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];

    const x = col * gridSize;
    const y = row * gridSize;

    // Cell border - thinner
    svg += `<rect x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" fill="none" stroke="#B45309" stroke-width="0.3"/>`;
    
    // Sign and house number - scaled
    svg += `<text x="${x + gridSize * 0.08}" y="${y + gridSize * 0.17}" font-size="${size * 0.022}" fill="#B45309" font-family="Arial">${ZODIAC_SIGNS_SHORT[signIndex]}${houseNumber}</text>`;

    // Planets with degree - scaled
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + gridSize * (0.35 + idx * 0.22);
      const suffix = planet.retrograde ? 'R' : '';
      const degreeText = formatDegree(planet.vargaDegree || 0);
      svg += `<text x="${x + gridSize * 0.08}" y="${planetY}" font-size="${size * 0.018}" fill="#000000" font-family="Arial">${getPlanetShort(planet.name)}${suffix} <tspan font-size="${size * 0.014}" fill="#666">${degreeText}</tspan></text>`;
    });
  }

  svg += '</g></svg>';
  return svg;
}

// SVG to Canvas converter with HIGH RESOLUTION
async function svgToCanvas(svgString: string, size: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    // Use 3x resolution for sharp output
    const scale = 3;
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }
    
    // Enable high-quality image rendering
    ctx.scale(scale, scale);

    const img = new Image();
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
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

  // === LEFT: South Indian Chart - HIGH RES ===
  const chartSvg = generateSouthIndianChartSVG(chartData, 800, true);
  const chartCanvas = await svgToCanvas(chartSvg, 800);
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
    const current = chartData.dashas.current;
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(getPlanetName(current.planet), dasaX + 2, dasaY + 9);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${formatDate(current.startDate)} - ${formatDate(current.endDate)}`, dasaX + 2, dasaY + 13);

    pdf.text(`Qua: ${current.elapsed?.years || 0}y ${current.elapsed?.months || 0}m`, dasaX + 2, dasaY + 17);
    pdf.text(`Con: ${current.remaining?.years || 0}y ${current.remaining?.months || 0}m`, dasaX + dasaWidth - 25, dasaY + 17);
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

  // === Antar Dasha Table - Use antardashas array from current ===
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

  // Table rows - Use antardashas array from current Dasha
  pdf.setFont('helvetica', 'normal');
  const antardashas = chartData.dashas?.current?.antardashas || [];
  if (antardashas.length > 0) {
    antardashas.forEach((dasha) => {
      if (dasaY > pageHeight - 50) return;
      pdf.setFontSize(5);
      pdf.text(getPlanetName(dasha.planet), dasaX + 2, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), dasaX + 25, dasaY);
      dasaY += 3.5;
    });
  } else if (chartData.dashas?.current?.currentAntardasha) {
    // Fallback: show current antardasha
    const currentAnt = chartData.dashas.current.currentAntardasha;
    pdf.setFontSize(5);
    pdf.text(getPlanetName(currentAnt.planet), dasaX + 2, dasaY);
    pdf.text(formatDate(currentAnt.startDate).substring(0, 10), dasaX + 25, dasaY);
    dasaY += 3.5;
  }

  dasaY += 3;

  // === Pratyantar Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(dasaX, dasaY, dasaWidth - 3, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRATYANTAR DASA', dasaX + 2, dasaY + 3.5);
  dasaY += 7;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hanh Tinh', dasaX + 2, dasaY);
  pdf.text('Bat Dau', dasaX + 25, dasaY);
  dasaY += 4;

  // Table rows - Use pratyantars from first antardasha
  pdf.setFont('helvetica', 'normal');
  const pratyantars = antardashas[0]?.pratyantars || [];
  
  if (chartData.dashas?.current?.currentAntardasha?.currentPratyantar) {
    // Show current pratyantar
    const currentPrat = chartData.dashas.current.currentAntardasha.currentPratyantar;
    pdf.setFontSize(5);
    pdf.text(getPlanetName(currentPrat.planet), dasaX + 2, dasaY);
    pdf.text(formatDate(currentPrat.startDate).substring(0, 10), dasaX + 25, dasaY);
    dasaY += 3.5;
  } else if (pratyantars.length > 0) {
    // Fallback: show pratyantars from first antardasha
    pratyantars.forEach((dasha) => {
      if (dasaY > pageHeight - 50) return;
      pdf.setFontSize(5);
      pdf.text(getPlanetName(dasha.planet), dasaX + 2, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), dasaX + 25, dasaY);
      dasaY += 3.5;
    });
  }

  // === Bottom Section: Planetary Details Table ===
  const planetTableY = topSectionY + chartHeightMM + 6;

  // Section Header
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin, planetTableY, contentWidth, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHI TIET CAC HANH TINH (GRAHA)', pageWidth / 2, planetTableY + 3.5, { align: 'center' });

  let tableY = planetTableY + 8;

  // Table header - COMPACT spacing
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  const colWidths = [18, 10, 28, 10, 24, 18, 8, 18];
  const cols = ['Hanh Tinh', 'Cung', 'Vi tri', 'Nha', 'Nakshatra', 'Chu Nha', 'Pada', 'Chuyen Dong'];
  let colX = margin;
  cols.forEach((header, i) => {
    pdf.text(header, colX, tableY);
    colX += colWidths[i];
  });

  tableY += 3;
  pdf.setDrawColor(180, 83, 9);
  pdf.line(margin, tableY - 0.5, margin + contentWidth, tableY - 0.5);

  // Table rows - COMPACT spacing
  pdf.setFont('helvetica', 'normal');
  chartData.planets.forEach((planet) => {
    if (tableY > pageHeight - 15) return;

    colX = margin;

    // Planet name - short only to save space
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${getPlanetShort(planet.name)}`, colX, tableY);
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

    // Nakshatra
    pdf.text(planet.nakshatra.name, colX, tableY);
    colX += colWidths[4];

    // Lord
    pdf.text(planet.nakshatra.lord, colX, tableY);
    colX += colWidths[5];

    // Pada
    pdf.text(`${planet.nakshatra.pada}`, colX, tableY);
    colX += colWidths[6];

    // Motion
    pdf.setTextColor(planet.retrograde ? 200 : 0, planet.retrograde ? 0 : 100, planet.retrograde ? 0 : 0);
    pdf.text(planet.retrograde ? 'Nghich' : 'Thuan', colX, tableY);
    pdf.setTextColor(0, 0, 0);

    tableY += 4;
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

  // Grid layout: 4 columns x 4 rows - NO BORDERS, MAX SIZE
  const gridStartY = 18;
  const gridCols = 4;
  const gridRows = 4;
  const gap = 3; // Small gap between charts
  const availableWidth = contentWidth - gap * (gridCols - 1);
  const availableHeight = pageHeight - gridStartY - 8 - gap * (gridRows - 1);
  const cellWidth = availableWidth / gridCols;
  const cellHeight = availableHeight / gridRows;

  for (let i = 0; i < VARGAS_DATA.length; i++) {
    const varga = VARGAS_DATA[i];
    const vargaData = vargaCharts[varga.key];

    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    // Position each chart
    const chartX = margin + col * (cellWidth + gap);
    const chartY = gridStartY + row * (cellHeight + gap);
    const chartSize = Math.min(cellWidth, cellHeight);

    // Generate mini chart SVG - larger size for better quality
    const miniSvg = generateMiniChartSVG(vargaData, 200);
    const miniCanvas = await svgToCanvas(miniSvg, 200);
    const miniImgData = miniCanvas.toDataURL('image/png', 1.0);

    // Draw mini chart directly - NO BORDER
    pdf.addImage(miniImgData, 'PNG', chartX, chartY, chartSize, chartSize);

    // Title ABOVE the chart (not overlaid)
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(180, 83, 9);
    const titleText = `${varga.id} - ${varga.name}`;
    pdf.text(titleText, chartX + chartSize / 2, chartY - 1.5, { align: 'center' });
  }

  // Footer
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.text('ChiEm Tinh Ve Da - Vedic Astrology', pageWidth / 2, pageHeight - 4, { align: 'center' });

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
  const chartSvg = generateSouthIndianChartSVG(chartData, 1200, true);
  const chartCanvas = await svgToCanvas(chartSvg, 1200);

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
    }
    .chart-container { width: 100%; max-width: 500px; }
    .mini-chart { width: 100%; height: auto; }
    .votive-border { border-color: #B45309; }
    .votive-bg { background-color: #B45309; }
    .votive-text { color: #B45309; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 3px 5px; text-align: left; font-size: 9px; }
    th { background-color: #fef3c7; }
    .vargas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
    .varga-item { padding: 2px; text-align: center; }
    .varga-title { font-size: 8px; font-weight: bold; color: #B45309; margin-bottom: 1px; }
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
            ${generateSouthIndianChartSVG(chartData, 600, true)}
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
              ${(chartData.dashas?.current?.antardashas || []).map(d => `
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
              ${(chartData.dashas?.current?.antardashas?.[0]?.pratyantars || []).map(d => `
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

    <!-- Planetary Details - COMPACT -->
    <div class="mt-3 border-2 border-votive-border rounded-lg overflow-hidden">
      <div class="votive-bg text-white p-2">
        <h2 class="text-sm font-bold text-center">CHI TIẾT CÁC HÀNH TINH (GRAHA)</h2>
      </div>
      <table class="w-full text-xs">
        <thead class="bg-amber-100">
          <tr>
            <th class="p-1">Hành Tinh</th>
            <th class="p-1">Cung</th>
            <th class="p-1">Vị trí</th>
            <th class="p-1">Nhà</th>
            <th class="p-1">Nakshatra</th>
            <th class="p-1">Chủ Nhà</th>
            <th class="p-1">Pada</th>
            <th class="p-1">Chuyển động</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.planets.map(p => `
            <tr>
              <td class="p-1 font-bold">${getPlanetShort(p.name)}</td>
              <td class="p-1">${ZODIAC_SIGNS_VI[p.sign]}</td>
              <td class="p-1">${formatDegree(p.longitude)}</td>
              <td class="p-1">${p.house}</td>
              <td class="p-1">${p.nakshatra.name}</td>
              <td class="p-1">${p.nakshatra.lord}</td>
              <td class="p-1">${p.nakshatra.pada}</td>
              <td class="p-1 ${p.retrograde ? 'text-red-600' : 'text-green-600'}">${p.retrograde ? 'Nghịch' : 'Thuận'}</td>
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

    <!-- Vargas Grid - NO BORDERS -->
    <div class="vargas-grid border-2 border-votive-border rounded-b-lg p-2">
      ${VARGAS_DATA.map(varga => {
        const vargaData = vargaCharts[varga.key];
        return `
          <div class="varga-item">
            <div class="varga-title">${varga.id} - ${varga.name}</div>
            <div class="mini-chart">
              ${generateMiniChartSVG(vargaData, 150)}
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
