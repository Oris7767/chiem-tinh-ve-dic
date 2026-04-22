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
  "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ",
  "Thiên Bình", "Bọ Cạp", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"
];

const ZODIAC_SIGNS_SHORT = [
  "Ar", "Ta", "Ge", "Ca", "Le", "Vi",
  "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
];

const PLANET_NAMES_VI: Record<string, string> = {
  'Sun': 'Mặt Trời', 'Moon': 'Mặt Trăng', 'Mars': 'Sao Hỏa',
  'Mercury': 'Sao Thủy', 'Jupiter': 'Sao Mộc', 'Venus': 'Sao Kim',
  'Saturn': 'Sao Thổ', 'Rahu': 'Sao Rahu', 'Ketu': 'Sao Ketu',
  'Uranus': 'Sao Thiên Vương', 'Neptune': 'Sao Hải Vương', 'Pluto': 'Sao Diêm Vương'
};

const PLANET_ABBR: Record<string, string> = {
  "Sun": "Su", "Moon": "Mo", "Mercury": "Me", "Venus": "Ve",
  "Mars": "Ma", "Jupiter": "Ju", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke",
  "Uranus": "Ur", "Neptune": "Ne", "Pluto": "Pl"
};

// 16 Vargas tiêu chuẩn
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

function getPlanetAbbr(name: string): string {
  return PLANET_ABBR[name] || name.substring(0, 2);
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

    // Planets
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + (42 + idx * 12) * scale;
      const suffix = planet.retrograde ? 'ᴿ' : '';
      const degreeText = showCoords ? ` ${formatDegree(planet.longitude)}` : '';
      svg += `<text x="${x + 5 * scale}" y="${planetY}" font-size="${8 * scale}" fill="#000000">${getPlanetAbbr(planet.name)}${suffix}${degreeText}</text>`;
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

    // Planets with degree
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + (24 + idx * 11) * scale;
      const suffix = planet.retrograde ? 'ᴿ' : '';
      const degreeText = formatDegree(planet.vargaDegree || 0);
      svg += `<text x="${x + 3 * scale}" y="${planetY}" font-size="${7 * scale}" fill="#000000">${getPlanetAbbr(planet.name)}${suffix} <tspan font-size="5" fill="#666">${degreeText}</tspan></text>`;
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
  pdf.rect(0, 0, pageWidth, 25, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LÁ SỐ CHIÊM TINH VỆ ĐÀ', pageWidth / 2, 10, { align: 'center' });

  // User info
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  if (userData) {
    const birthInfo = `${userData.name || 'Không tên'} - ${userData.birthDate || ''} ${userData.birthTime || ''} - ${userData.location || ''}`;
    pdf.text(birthInfo, pageWidth / 2, 18, { align: 'center' });
  }

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Top Section: Grid Layout (2 columns)
  const topSectionY = 30;
  const chartWidth = contentWidth * 0.65; // 2/3 width
  const dasaWidth = contentWidth * 0.35; // 1/3 width

  // === LEFT: South Indian Chart ===
  const chartSvg = generateSouthIndianChartSVG(chartData, 500, 500, true);
  const chartCanvas = await svgToCanvas(chartSvg, 500, 500);
  const chartImgData = chartCanvas.toDataURL('image/png', 1.0);

  // Calculate chart size to fit in the allocated space
  const chartHeightMM = chartWidth; // Keep aspect ratio 1:1
  pdf.addImage(chartImgData, 'PNG', margin, topSectionY, chartWidth, chartHeightMM);

  // === RIGHT: Dasa System (Flat List) ===
  let dasaY = topSectionY + 3;

  // Current Dasha Header
  pdf.setFillColor(255, 250, 240);
  pdf.rect(margin + chartWidth + 3, dasaY, dasaWidth - 3, 25, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('ĐẠI VẬN HIỆN TẠI', margin + chartWidth + 5, dasaY + 5);

  if (chartData.dashas?.current) {
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(PLANET_NAMES_VI[chartData.dashas.current.planet] || chartData.dashas.current.planet, margin + chartWidth + 5, dasaY + 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, margin + chartWidth + 5, dasaY + 15);

    pdf.text(`Qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m`, margin + chartWidth + 5, dasaY + 20);
    pdf.text(`Còn: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m`, margin + chartWidth + dasaWidth - 20, dasaY + 20);
  }

  dasaY += 28;

  // === Maha Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin + chartWidth + 3, dasaY, dasaWidth - 3, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VIMSHOTTARI MAHA DASA', margin + chartWidth + 5, dasaY + 4);
  dasaY += 8;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STT', margin + chartWidth + 5, dasaY);
  pdf.text('Hành Tinh', margin + chartWidth + 13, dasaY);
  pdf.text('Bắt Đầu', margin + chartWidth + 38, dasaY);
  pdf.text('Kết Thúc', margin + chartWidth + 58, dasaY);
  dasaY += 5;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  if (chartData.dashas?.sequence) {
    chartData.dashas.sequence.forEach((dasha, index) => {
      if (dasaY > pageHeight - 50) return; // Avoid overflow
      pdf.setFontSize(6);
      pdf.text(`${index + 1}`, margin + chartWidth + 5, dasaY);
      pdf.text(PLANET_NAMES_VI[dasha.planet] || dasha.planet, margin + chartWidth + 13, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), margin + chartWidth + 38, dasaY);
      pdf.text(formatDate(dasha.endDate).substring(0, 10), margin + chartWidth + 58, dasaY);
      dasaY += 4;
    });
  }

  dasaY += 4;

  // === Antar Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin + chartWidth + 3, dasaY, dasaWidth - 3, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ANTAR DASA (TIỂU VẬN)', margin + chartWidth + 5, dasaY + 4);
  dasaY += 8;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hành Tinh', margin + chartWidth + 5, dasaY);
  pdf.text('Bắt Đầu', margin + chartWidth + 25, dasaY);
  pdf.text('Kết Thúc', margin + chartWidth + 50, dasaY);
  dasaY += 5;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  const antardashaSequence = chartData.dashas?.current?.antardasha?.sequence || [];
  antardashaSequence.forEach((dasha) => {
    if (dasaY > pageHeight - 50) return;
    pdf.setFontSize(6);
    pdf.text(PLANET_NAMES_VI[dasha.planet] || dasha.planet, margin + chartWidth + 5, dasaY);
    pdf.text(formatDate(dasha.startDate).substring(0, 10), margin + chartWidth + 25, dasaY);
    pdf.text(formatDate(dasha.endDate).substring(0, 10), margin + chartWidth + 50, dasaY);
    dasaY += 4;
  });

  dasaY += 4;

  // === Pratyantar Dasha Table ===
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin + chartWidth + 3, dasaY, dasaWidth - 3, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRATYANTAR DASA (PHÂN VẬN)', margin + chartWidth + 5, dasaY + 4);
  dasaY += 8;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hành Tinh', margin + chartWidth + 5, dasaY);
  pdf.text('Bắt Đầu', margin + chartWidth + 25, dasaY);
  pdf.text('Kết Thúc', margin + chartWidth + 50, dasaY);
  dasaY += 5;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  const currentAntardasha = antardashaSequence[0]; // Current antardasha
  if (currentAntardasha?.pratyantardasha) {
    currentAntardasha.pratyantardasha.forEach((dasha) => {
      if (dasaY > pageHeight - 50) return;
      pdf.setFontSize(6);
      pdf.text(PLANET_NAMES_VI[dasha.planet] || dasha.planet, margin + chartWidth + 5, dasaY);
      pdf.text(formatDate(dasha.startDate).substring(0, 10), margin + chartWidth + 25, dasaY);
      pdf.text(formatDate(dasha.endDate).substring(0, 10), margin + chartWidth + 50, dasaY);
      dasaY += 4;
    });
  }

  // === Bottom Section: Planetary Details Table ===
  const planetTableY = chartHeightMM + topSectionY + 5;

  // Section Header
  pdf.setFillColor(180, 83, 9);
  pdf.rect(margin, planetTableY, contentWidth, 7, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHI TIẾT CÁC HÀNH TINH (GRAHA)', pageWidth / 2, planetTableY + 5, { align: 'center' });

  let tableY = planetTableY + 10;

  // Table header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const colWidths = [25, 12, 35, 20, 15, 35, 12, 20];
  const cols = ['Hành Tinh', 'Cung', 'Vị trí', 'Nhà', 'Nakshatra', 'Chủ', 'Pada', 'Chuyển động'];
  let colX = margin;
  cols.forEach((header, i) => {
    pdf.text(header, colX, tableY);
    colX += colWidths[i];
  });

  tableY += 5;
  pdf.setDrawColor(180, 83, 9);
  pdf.line(margin, tableY - 2, margin + contentWidth, tableY - 2);

  // Table rows
  pdf.setFont('helvetica', 'normal');
  chartData.planets.forEach((planet) => {
    if (tableY > pageHeight - 20) return;

    pdf.setFontSize(7);
    colX = margin;

    // Planet name
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${planet.symbol} ${planet.name}`, colX, tableY);
    colX += colWidths[0];

    // Zodiac sign
    pdf.setFont('helvetica', 'normal');
    pdf.text(ZODIAC_SIGNS_VI[planet.sign], colX, tableY);
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
    pdf.setTextColor(planet.retrograde ? 200 : 0, planet.retrograde ? 0 : 150, planet.retrograde ? 0 : 0);
    pdf.text(planet.retrograde ? 'R (Nghịch)' : 'D (Thuận)', colX, tableY);
    pdf.setTextColor(0, 0, 0);

    tableY += 5;
  });

  // === PAGE 2: 16 D-Varga Charts ===
  pdf.addPage();

  // Header
  pdf.setFillColor(180, 83, 9);
  pdf.rect(0, 0, pageWidth, 18, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HỆ THỐNG 16 D-VARGA (PHÂN CUNG)', pageWidth / 2, 8, { align: 'center' });
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Theo hệ thống Parashara - Divisional Charts', pageWidth / 2, 14, { align: 'center' });

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
  const gridStartY = 22;
  const gridCols = 4;
  const gridRows = 4;
  const chartSpacingX = contentWidth / gridCols;
  const chartSpacingY = (pageHeight - gridStartY - 15) / gridRows;
  const miniChartSize = Math.min(chartSpacingX - 3, chartSpacingY - 8);

  for (let i = 0; i < VARGAS_DATA.length; i++) {
    const varga = VARGAS_DATA[i];
    const vargaData = vargaCharts[varga.key];

    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    const chartX = margin + col * chartSpacingX + (chartSpacingX - miniChartSize) / 2;
    const chartY = gridStartY + row * chartSpacingY + 4;

    // Chart background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(180, 83, 9);
    pdf.roundedRect(chartX, chartY, miniChartSize, miniChartSize - 3, 1, 1, 'FD');

    // Title
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(180, 83, 9);
    const titleText = `${varga.id} - ${varga.name}`;
    pdf.text(titleText, chartX + miniChartSize / 2, chartY + 3, { align: 'center' });

    // Generate mini chart SVG
    const miniSvg = generateMiniChartSVG(vargaData, 350, 350);
    const miniCanvas = await svgToCanvas(miniSvg, 350, 350);
    const miniImgData = miniCanvas.toDataURL('image/png', 1.0);

    // Draw mini chart
    const chartPadding = 4;
    pdf.addImage(miniImgData, 'PNG', chartX + chartPadding, chartY + 5, miniChartSize - chartPadding * 2, miniChartSize - 12);
  }

  // Footer
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Chiêm Tinh Vệ Đà - Vedic Astrology', pageWidth / 2, pageHeight - 8, { align: 'center' });

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

// Generate HTML for printing
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

  // Generate HTML
  let html = `
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
  </style>
</head>
<body class="bg-white text-black p-4">
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
    <div class="grid grid-cols-3 gap-2 mt-2">
      <!-- Chart (2/3) -->
      <div class="col-span-2">
        <div class="border-2 border-votive-border rounded-lg p-2 flex justify-center">
          <div class="chart-container">
            ${generateSouthIndianChartSVG(chartData, 500, 500, true)}
          </div>
        </div>
      </div>

      <!-- Dasa System (1/3) -->
      <div class="border-2 border-votive-border rounded-lg p-2">
        <!-- Current Dasha -->
        <div class="bg-amber-50 p-2 rounded mb-2">
          <h3 class="text-xs font-bold text-votive-bg">ĐẠI VẬN HIỆN TẠI</h3>
          ${chartData.dashas?.current ? `
            <p class="font-bold">${PLANET_NAMES_VI[chartData.dashas.current.planet]}</p>
            <p class="text-xs">${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}</p>
            <p class="text-xs">Qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m</p>
          ` : ''}
        </div>

        <!-- Maha Dasha -->
        <div class="mb-2">
          <h3 class="text-xs font-bold text-white bg-votive-bg p-1 rounded">VIMSHOTTARI MAHA DASA</h3>
          <table class="w-full text-xs mt-1">
            <thead>
              <tr class="bg-amber-100">
                <th class="p-1 text-left">STT</th>
                <th class="p-1 text-left">Hành Tinh</th>
                <th class="p-1 text-left">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.sequence || []).map((d, i) => `
                <tr class="border-b">
                  <td class="p-1">${i + 1}</td>
                  <td class="p-1 font-medium">${PLANET_NAMES_VI[d.planet]}</td>
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
                <th class="p-1 text-left">Hành Tinh</th>
                <th class="p-1 text-left">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.current?.antardasha?.sequence || []).map(d => `
                <tr class="border-b">
                  <td class="p-1 font-medium">${PLANET_NAMES_VI[d.planet]}</td>
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
                <th class="p-1 text-left">Hành Tinh</th>
                <th class="p-1 text-left">Bắt Đầu</th>
              </tr>
            </thead>
            <tbody>
              ${(chartData.dashas?.current?.antardasha?.sequence[0]?.pratyantardasha || []).map(d => `
                <tr class="border-b">
                  <td class="p-1 font-medium">${PLANET_NAMES_VI[d.planet]}</td>
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
            <th class="p-2 text-left">Hành Tinh</th>
            <th class="p-2 text-left">Cung</th>
            <th class="p-2 text-left">Vị trí</th>
            <th class="p-2 text-left">Nhà</th>
            <th class="p-2 text-left">Nakshatra</th>
            <th class="p-2 text-left">Chủ</th>
            <th class="p-2 text-left">Pada</th>
            <th class="p-2 text-left">Chuyển động</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.planets.map(p => `
            <tr class="border-b hover:bg-amber-50">
              <td class="p-2 font-bold">${p.symbol} ${p.name}</td>
              <td class="p-2">${ZODIAC_SIGNS_VI[p.sign]}</td>
              <td class="p-2">${formatDegree(p.longitude)}</td>
              <td class="p-2">${p.house}</td>
              <td class="p-2">${p.nakshatra.name}</td>
              <td class="p-2">${p.nakshatra.lord}</td>
              <td class="p-2">${p.nakshatra.pada}</td>
              <td class="p-2 ${p.retrograde ? 'text-red-600' : 'text-green-600'}">${p.retrograde ? 'R' : 'D'}</td>
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
    <div class="grid grid-cols-4 gap-2 mt-2 border-2 border-votive-border rounded-b-lg p-2">
      ${VARGAS_DATA.map(varga => {
        const vargaData = vargaCharts[varga.key];
        return `
          <div class="border border-votive-border rounded p-1 flex flex-col items-center no-break">
            <h4 class="text-xs font-bold text-votive-bg mb-1">${varga.id} - ${varga.name}</h4>
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

  <script>
    // Auto-print when opened
    // window.onload = () => window.print();
  </script>
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
