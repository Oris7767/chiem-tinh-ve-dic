import { ChartMetadata, NakshatraInfo, DashaPeriod } from './vedicAstrology/config';

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  color: string;
  longitude: number;
  latitude: number;
  longitudeSpeed: number;
  sign: number;
  house: number;
  retrograde: boolean;
  nakshatra: NakshatraInfo;
  aspectingPlanets: string[];
  aspects: Array<{
    planet: string;
    type: string;
    orb: number;
  }>;
}

export interface House {
  number: number;
  sign: number;
  longitude: number;
  planets: string[];
}

export interface VedicChartData {
  ascendant: number;
  ascendantNakshatra: NakshatraInfo;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
  metadata: ChartMetadata;
  dashas: {
    current: DashaPeriod;
    sequence: DashaPeriod[];
  };
}

interface BirthDataFormValues {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
}

// Zodiac signs in Vietnamese
const ZODIAC_SIGNS = [
  "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ",
  "Thiên Bình", "Bọ Cạp", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"
];

// Vedic planet names
const VEDIC_PLANET_NAMES: Record<string, string> = {
  "Sun": "Surya (Mặt Trời)",
  "Moon": "Chandra (Mặt Trăng)",
  "Mercury": "Budha (Sao Thủy)",
  "Venus": "Shukra (Sao Kim)",
  "Mars": "Mangal (Sao Hỏa)",
  "Jupiter": "Guru (Sao Mộc)",
  "Saturn": "Shani (Sao Thổ)",
  "Rahu": "Rahu",
  "Ketu": "Ketu"
};

// House names and meanings
const HOUSE_NAMES = {
  1: { sanskrit: "Tanu Bhava", meaning: "Bản thân / Tính cách / Sức khỏe" },
  2: { sanskrit: "Dhana Bhava", meaning: "Tài sản / Gia đình / Lời nói" },
  3: { sanskrit: "Sahaja Bhava", meaning: "Anh chị em / Can đảm / Giao tiếp" },
  4: { sanskrit: "Sukha Bhava", meaning: "Mẹ / Nhà cửa / Hạnh phúc" },
  5: { sanskrit: "Putra Bhava", meaning: "Con cái / Trí tuệ / Sáng tạo" },
  6: { sanskrit: "Ari Bhava", meaning: "Kẻ thù / Bệnh tật / Dịch vụ" },
  7: { sanskrit: "Kalatra Bhava", meaning: "Hôn nhân / Đối tác / Quan hệ" },
  8: { sanskrit: "Ayu Bhava", meaning: "Tuổi thọ / Biến đổi / Bí ẩn" },
  9: { sanskrit: "Bhagya Bhava", meaning: "Vận may / Tôn giáo / Triết học" },
  10: { sanskrit: "Karma Bhava", meaning: "Sự nghiệp / Danh tiếng / Cha" },
  11: { sanskrit: "Labha Bhava", meaning: "Lợi nhuận / Bạn bè / Ước mơ" },
  12: { sanskrit: "Vyaya Bhava", meaning: "Tổn thất / Giải thoát / Tiềm thức" }
};

// Planet names in Vietnamese
const PLANET_NAMES_VI = {
  'Sun': 'Mặt Trời',
  'Moon': 'Mặt Trăng',
  'Mars': 'Sao Hỏa',
  'Mercury': 'Sao Thủy',
  'Jupiter': 'Sao Mộc',
  'Venus': 'Sao Kim',
  'Saturn': 'Sao Thổ',
  'Rahu': 'Sao Rahu',
  'Ketu': 'Sao Ketu'
};

export function createCompleteSVGExport(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): string {
  const chartSVG = getChartSVG(chartData, userData);
  const planetDetailsSVG = createPlanetDetailsSVG(chartData.planets);
  const houseDetailsSVG = createHouseDetailsSVG(chartData.houses, chartData.planets);
  const dashaSVG = createDashaSVG(chartData.dashas);

  // Create a comprehensive SVG with all information
  const completeSVG = `<?xml version="1.0" standalone="no"?>
<svg width="1200" height="1600" viewBox="0 0 1200 1600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #B45309; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #666; }
      .section-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #B45309; }
      .table-header { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #333; }
      .table-cell { font-family: Arial, sans-serif; font-size: 11px; fill: #000; }
      .table-cell-small { font-family: Arial, sans-serif; font-size: 10px; fill: #666; }
      .dasha-current { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #B45309; }
      .dasha-text { font-family: Arial, sans-serif; font-size: 11px; fill: #000; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="1200" height="1600" fill="white" stroke="#ddd" stroke-width="1"/>
  
  <!-- Main Title -->
  <text x="600" y="30" text-anchor="middle" class="title">
    Vedic Birth Chart${userData?.name ? ` for ${userData.name}` : ''}
  </text>
  
  ${userData ? `
  <text x="600" y="50" text-anchor="middle" class="subtitle">
    ${formatBirthInfo(userData)}
  </text>
  ` : ''}
  
  <!-- Chart Section -->
  <g transform="translate(100, 80)">
    ${chartSVG}
  </g>
  
  <!-- Planet Details Section -->
  <g transform="translate(50, 650)">
    <text x="0" y="0" class="section-title">Chi tiết các hành tinh (Graha)</text>
    ${planetDetailsSVG}
  </g>
  
  <!-- House Details Section -->
  <g transform="translate(650, 650)">
    <text x="0" y="0" class="section-title">Chi tiết các nhà (Bhava)</text>
    ${houseDetailsSVG}
  </g>
  
  <!-- Dasha Section -->
  <g transform="translate(50, 1200)">
    <text x="0" y="0" class="section-title">Vimshottari Dasha (Chu kỳ hành tinh)</text>
    ${dashaSVG}
  </g>
  
  <!-- Footer -->
  <text x="600" y="1580" text-anchor="middle" class="table-cell-small">
    Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}
  </text>
</svg>`;

  return completeSVG;
}

function formatBirthInfo(userData: BirthDataFormValues): string {
  const parts = [];
  if (userData.birthDate) {
    parts.push(new Date(userData.birthDate).toLocaleDateString('vi-VN'));
  }
  if (userData.birthTime) {
    parts.push(userData.birthTime);
  }
  if (userData.location) {
    parts.push(userData.location);
  }
  return parts.join(' - ');
}

function getChartSVG(chartData: VedicChartData, userData?: BirthDataFormValues | null): string {
  // Get the existing chart SVG element and extract its content
  const svgElement = document.getElementById('birth-chart-svg');
  if (!svgElement) return '';
  
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Remove the viewBox and adjust for embedding
  svgClone.removeAttribute('viewBox');
  svgClone.setAttribute('width', '500');
  svgClone.setAttribute('height', '500');
  
  const serializer = new XMLSerializer();
  let svgContent = serializer.serializeToString(svgClone);
  
  // Extract only the inner content (remove svg tags)
  const match = svgContent.match(/<svg[^>]*>(.*)<\/svg>/s);
  return match ? match[1] : svgContent;
}

function createPlanetDetailsSVG(planets: Planet[]): string {
  const formatDegree = (longitude: number): string => {
    const totalDegrees = longitude % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getZodiacSign = (signIndex: number): string => {
    return ZODIAC_SIGNS[signIndex] || 'Unknown';
  };

  let y = 25;
  let svg = `
    <!-- Table Header -->
    <rect x="0" y="15" width="500" height="20" fill="#f5f5f5" stroke="#ddd"/>
    <text x="5" y="28" class="table-header">Hành tinh</text>
    <text x="80" y="28" class="table-header">Tên Sanskrit</text>
    <text x="180" y="28" class="table-header">Cung</text>
    <text x="250" y="28" class="table-header">Vị trí</text>
    <text x="320" y="28" class="table-header">Nhà</text>
    <text x="350" y="28" class="table-header">Nakshatra</text>
    <text x="450" y="28" class="table-header">Pada</text>
  `;

  planets.forEach((planet, index) => {
    y = 45 + index * 25;
    const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
    
    svg += `
      <rect x="0" y="${y - 12}" width="500" height="20" fill="${bgColor}" stroke="#eee"/>
      <text x="5" y="${y}" class="table-cell" fill="${planet.color}">
        ${planet.symbol} ${planet.name}
      </text>
      <text x="80" y="${y}" class="table-cell">
        ${VEDIC_PLANET_NAMES[planet.name] || planet.name}
      </text>
      <text x="180" y="${y}" class="table-cell">
        ${getZodiacSign(planet.sign)}
      </text>
      <text x="250" y="${y}" class="table-cell">
        ${formatDegree(planet.longitude)}
      </text>
      <text x="320" y="${y}" class="table-cell">
        ${planet.house}
      </text>
      <text x="350" y="${y}" class="table-cell">
        ${planet.nakshatra.name}
      </text>
      <text x="450" y="${y}" class="table-cell">
        ${planet.nakshatra.pada}
      </text>
    `;
  });

  return svg;
}

function createHouseDetailsSVG(houses: House[], planets: Planet[]): string {
  const getZodiacSign = (signIndex: number): string => {
    return ZODIAC_SIGNS[signIndex] || 'Unknown';
  };

  const getPlanetSymbols = (planetIds: string[]): string => {
    return planetIds.map(planetId => {
      const planet = planets.find(p => p.id === planetId);
      return planet ? planet.symbol : '';
    }).join(' ');
  };

  let y = 25;
  let svg = `
    <!-- Table Header -->
    <rect x="0" y="15" width="500" height="20" fill="#f5f5f5" stroke="#ddd"/>
    <text x="5" y="28" class="table-header">Nhà</text>
    <text x="40" y="28" class="table-header">Tên Sanskrit</text>
    <text x="140" y="28" class="table-header">Ý Nghĩa</text>
    <text x="350" y="28" class="table-header">Cung</text>
    <text x="420" y="28" class="table-header">Hành tinh</text>
  `;

  houses.forEach((house, index) => {
    y = 45 + index * 35;
    const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
    const houseInfo = HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES];
    
    svg += `
      <rect x="0" y="${y - 12}" width="500" height="30" fill="${bgColor}" stroke="#eee"/>
      <text x="5" y="${y}" class="table-cell">
        ${house.number}
      </text>
      <text x="40" y="${y}" class="table-cell">
        ${houseInfo.sanskrit}
      </text>
      <text x="140" y="${y}" class="table-cell-small">
        ${houseInfo.meaning}
      </text>
      <text x="350" y="${y}" class="table-cell">
        ${getZodiacSign(house.sign)}
      </text>
      <text x="420" y="${y}" class="table-cell">
        ${getPlanetSymbols(house.planets)}
      </text>
    `;
  });

  return svg;
}

function createDashaSVG(dashas: any): string {
  if (!dashas || !dashas.current) return '';

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch (e) {
      return dateStr;
    }
  };

  const getViPlanetName = (planet: string) => {
    return PLANET_NAMES_VI[planet as keyof typeof PLANET_NAMES_VI] || planet;
  };

  const current = dashas.current;
  
  let svg = `
    <!-- Current Dasha -->
    <rect x="0" y="15" width="1100" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="10" y="35" class="dasha-current">Chu kỳ hiện tại:</text>
    <text x="10" y="55" class="dasha-text">
      ${getViPlanetName(current.planet)} - ${formatDate(current.startDate)} đến ${formatDate(current.endDate)}
    </text>
    <text x="10" y="75" class="dasha-text">
      Đã qua: ${current.elapsed?.years || 0} năm, ${current.elapsed?.months || 0} tháng, ${current.elapsed?.days || 0} ngày
    </text>
    <text x="400" y="75" class="dasha-text">
      Còn lại: ${current.remaining?.years || 0} năm, ${current.remaining?.months || 0} tháng, ${current.remaining?.days || 0} ngày
    </text>
  `;

  // Add sequence if available
  if (dashas.sequence && dashas.sequence.length > 0) {
    svg += `
      <text x="0" y="120" class="section-title">Trình tự Dasha:</text>
      <!-- Table Header -->
      <rect x="0" y="130" width="1100" height="20" fill="#f5f5f5" stroke="#ddd"/>
      <text x="5" y="143" class="table-header">Hành Tinh</text>
      <text x="150" y="143" class="table-header">Ngày Bắt Đầu</text>
      <text x="300" y="143" class="table-header">Ngày Kết Thúc</text>
      <text x="450" y="143" class="table-header">Thời Gian (năm)</text>
    `;

    dashas.sequence.slice(0, 15).forEach((dasha: any, index: number) => {
      const y = 165 + index * 20;
      const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
      
      svg += `
        <rect x="0" y="${y - 12}" width="1100" height="18" fill="${bgColor}" stroke="#eee"/>
        <text x="5" y="${y}" class="table-cell">
          ${getViPlanetName(dasha.planet)}
        </text>
        <text x="150" y="${y}" class="table-cell">
          ${formatDate(dasha.startDate)}
        </text>
        <text x="300" y="${y}" class="table-cell">
          ${formatDate(dasha.endDate)}
        </text>
        <text x="450" y="${y}" class="table-cell">
          ${((dasha.endDate ? new Date(dasha.endDate).getTime() : 0) - (dasha.startDate ? new Date(dasha.startDate).getTime() : 0)) / (365.25 * 24 * 60 * 60 * 1000) || 0}
        </text>
      `;
    });
  }

  return svg;
}

export function downloadCompleteSVG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): void {
  const svgContent = createCompleteSVGExport(chartData, userData);
  
  // Create blob and download
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  
  // Generate filename
  const fileName = userData?.name 
    ? `vedic-chart-complete-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.svg`
    : 'vedic-birth-chart-complete.svg';
  
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

// Function to download separate SVG files for different sections
export function downloadSeparateSVGs(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): void {
  const baseFileName = userData?.name 
    ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}`
    : 'vedic-birth-chart';

  // Download chart SVG
  const chartSVG = createChartOnlySVG(chartData, userData);
  downloadSVGFile(chartSVG, `${baseFileName}-chart.svg`);

  // Download details SVG
  const detailsSVG = createDetailsOnlySVG(chartData, userData);
  downloadSVGFile(detailsSVG, `${baseFileName}-details.svg`);
}

function createChartOnlySVG(chartData: VedicChartData, userData?: BirthDataFormValues | null): string {
  const chartSVG = getChartSVG(chartData, userData);
  
  return `<?xml version="1.0" standalone="no"?>
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #B45309; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #666; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="600" height="600" fill="white" stroke="#ddd" stroke-width="1"/>
  
  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" class="title">
    Vedic Birth Chart${userData?.name ? ` for ${userData.name}` : ''}
  </text>
  
  ${userData ? `
  <text x="300" y="50" text-anchor="middle" class="subtitle">
    ${formatBirthInfo(userData)}
  </text>
  ` : ''}
  
  <!-- Chart -->
  <g transform="translate(50, 70)">
    ${chartSVG}
  </g>
</svg>`;
}

function createDetailsOnlySVG(chartData: VedicChartData, userData?: BirthDataFormValues | null): string {
  const planetDetailsSVG = createPlanetDetailsSVG(chartData.planets);
  const houseDetailsSVG = createHouseDetailsSVG(chartData.houses, chartData.planets);
  const dashaSVG = createDashaSVG(chartData.dashas);

  return `<?xml version="1.0" standalone="no"?>
<svg width="1200" height="1000" viewBox="0 0 1200 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #B45309; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #666; }
      .section-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #B45309; }
      .table-header { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #333; }
      .table-cell { font-family: Arial, sans-serif; font-size: 11px; fill: #000; }
      .table-cell-small { font-family: Arial, sans-serif; font-size: 10px; fill: #666; }
      .dasha-current { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #B45309; }
      .dasha-text { font-family: Arial, sans-serif; font-size: 11px; fill: #000; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="1200" height="1000" fill="white" stroke="#ddd" stroke-width="1"/>
  
  <!-- Title -->
  <text x="600" y="30" text-anchor="middle" class="title">
    Vedic Chart Details${userData?.name ? ` for ${userData.name}` : ''}
  </text>
  
  ${userData ? `
  <text x="600" y="50" text-anchor="middle" class="subtitle">
    ${formatBirthInfo(userData)}
  </text>
  ` : ''}
  
  <!-- Planet Details Section -->
  <g transform="translate(50, 80)">
    <text x="0" y="0" class="section-title">Chi tiết các hành tinh (Graha)</text>
    ${planetDetailsSVG}
  </g>
  
  <!-- House Details Section -->
  <g transform="translate(650, 80)">
    <text x="0" y="0" class="section-title">Chi tiết các nhà (Bhava)</text>
    ${houseDetailsSVG}
  </g>
  
  <!-- Dasha Section -->
  <g transform="translate(50, 500)">
    <text x="0" y="0" class="section-title">Vimshottari Dasha (Chu kỳ hành tinh)</text>
    ${dashaSVG}
  </g>
</svg>`;
}

function downloadSVGFile(svgContent: string, fileName: string): void {
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  URL.revokeObjectURL(url);
} 