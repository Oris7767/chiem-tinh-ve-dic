import { VedicChartData } from './svgExportUtils';

interface BirthDataFormValues {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
}

// Zodiac signs
const ZODIAC_SIGNS = [
  "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ",
  "Thiên Bình", "Bọ Cạp", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"
];

// House names and meanings
const HOUSE_NAMES: Record<number, { sanskrit: string; meaning: string }> = {
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
const PLANET_NAMES_VI: Record<string, string> = {
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

// Helpers
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
}

function getViPlanetName(planet: string): string {
  return PLANET_NAMES_VI[planet] || planet;
}

// SVG to Canvas
async function svgToCanvas(svgElement: SVGSVGElement, width: number = 500, height: number = 500): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }

      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      svgClone.setAttribute('width', width.toString());
      svgClone.setAttribute('height', height.toString());
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      svgClone.querySelectorAll('script, style').forEach(s => s.remove());
      svgClone.querySelectorAll('image').forEach(img => {
        const href = img.getAttribute('href') || img.getAttribute('xlink:href');
        if (href && !href.startsWith('data:')) img.remove();
      });

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

      const img = new Image();
      const timeout = setTimeout(() => reject(new Error('SVG loading timeout')), 10000);

      img.onload = () => {
        clearTimeout(timeout);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load SVG as image'));
      };

      img.crossOrigin = 'anonymous';
      img.src = svgUrl;
    } catch (error) {
      reject(error);
    }
  });
}

// Wait for SVG render
async function waitForSVGRender(svgElement: SVGSVGElement, maxWaitTime = 5000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    if (svgElement.children.length > 0) {
      try {
        const bbox = svgElement.getBBox();
        if (bbox.width > 0 && bbox.height > 0) {
          return true;
        }
      } catch {
        // continue waiting
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return false;
}

// Grid 2x2 PNG Download
export async function downloadAsPNG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting PNG generation...');

    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('Biểu đồ chưa được tải.');
    }

    await waitForSVGRender(originalChart, 3000);
    const chartCanvas = await svgToCanvas(originalChart, 800, 800);

    // Canvas size (A4 x2 for high DPI)
    const fullWidth = 1190;
    const fullHeight = 1684;

    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = fullWidth;
    fullCanvas.height = fullHeight;
    const ctx = fullCanvas.getContext('2d');

    if (!ctx) throw new Error('Cannot create canvas context');

    // ============ BACKGROUND ============
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    // ============ HEADER ============
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    const title = userData?.name ? `Vedic Birth Chart - ${userData.name}` : 'Vedic Birth Chart';
    ctx.fillText(title, fullWidth / 2, 55);

    if (userData) {
      ctx.font = '22px Arial';
      ctx.fillStyle = '#666';
      const birthInfo = [
        userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '',
        userData.birthTime || '',
        userData.location || ''
      ].filter(Boolean).join(' | ');
      ctx.fillText(birthInfo, fullWidth / 2, 90);
    }

    // Header divider line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 120);
    ctx.lineTo(1150, 120);
    ctx.stroke();

    // ============ GRID LAYOUT CONSTANTS ============
    const LEFT_X = 50;
    const RIGHT_X = 620;
    const TOP_Y = 160;
    const BOTTOM_Y = 820;
    const ROW_H = 22;

    // Vertical divider (between columns)
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(595, 120);
    ctx.lineTo(595, 1600);
    ctx.stroke();

    // Horizontal divider (between top/bottom)
    ctx.beginPath();
    ctx.moveTo(40, 760);
    ctx.lineTo(1150, 760);
    ctx.stroke();

    // ============ TOP-LEFT: CHART ============
    ctx.drawImage(chartCanvas, LEFT_X, TOP_Y, 800, 800);

    // ============ TOP-RIGHT: DASHA ============
    let yRight = TOP_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Vimshottari Dasha hiện tại:', RIGHT_X, yRight);
    yRight += 30;

    if (chartData.dashas?.current) {
      ctx.fillStyle = '#333';
      ctx.font = '22px Arial';
      ctx.fillText(getViPlanetName(chartData.dashas.current.planet), RIGHT_X, yRight);
      yRight += 26;

      ctx.font = '16px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(`${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, RIGHT_X, yRight);
      yRight += 26;

      ctx.fillText(`Đã qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m`, RIGHT_X, yRight);
      ctx.fillText(`Còn lại: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m`, RIGHT_X + 200, yRight);
      yRight += 30;

      // Antardasha (Tiểu vận) - with Invalid Date check
      const antardasha = chartData.dashas.current.antardasha?.current;
      if (antardasha && antardasha.startDate && antardasha.endDate) {
        ctx.fillStyle = '#B45309';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Tiểu vận: ${getViPlanetName(antardasha.planet)}`, RIGHT_X, yRight);
        yRight += 26;

        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.fillText(`${formatDate(antardasha.startDate)} - ${formatDate(antardasha.endDate)}`, RIGHT_X, yRight);
        yRight += 36;
      } else {
        yRight += 10;
      }
    }

    // Maha Dasha sequence
    yRight += 10;
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Trật tự Maha Dasha:', RIGHT_X, yRight);
    yRight += 30;

    // Table header
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Hành tinh', RIGHT_X, yRight);
    ctx.fillText('Bắt đầu', RIGHT_X + 150, yRight);
    ctx.fillText('Kết thúc', RIGHT_X + 320, yRight);
    yRight += 28;

    // Dasha rows
    ctx.font = '16px Arial';
    chartData.dashas.sequence.forEach((dasha, index) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${index + 1}. ${getViPlanetName(dasha.planet)}`, RIGHT_X, yRight);

      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.fillText(formatDate(dasha.startDate), RIGHT_X + 150, yRight);
      ctx.fillText(formatDate(dasha.endDate), RIGHT_X + 320, yRight);
      ctx.font = '16px Arial';

      yRight += ROW_H;
    });

    // ============ BOTTOM-LEFT: PLANETS ============
    let yLeft = BOTTOM_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Chi tiết các hành tinh:', LEFT_X, yLeft);
    yLeft += 30;

    // Table header
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Hành tinh', LEFT_X, yLeft);
    ctx.fillText('Vị trí', LEFT_X + 130, yLeft);
    ctx.fillText('Nhà', LEFT_X + 310, yLeft);
    ctx.fillText('Nakshatra', LEFT_X + 370, yLeft);
    yLeft += 28;

    // Planet rows
    ctx.font = '16px Arial';
    chartData.planets.forEach((planet) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${planet.symbol} ${planet.name}`, LEFT_X, yLeft);

      const degrees = Math.floor(planet.longitude % 30);
      const minutes = Math.floor((planet.longitude % 30 - degrees) * 60);
      ctx.fillText(`${ZODIAC_SIGNS[planet.sign]} ${degrees}°${minutes}'`, LEFT_X + 130, yLeft);

      ctx.fillText(`${planet.house}`, LEFT_X + 310, yLeft);
      ctx.fillText(`${planet.nakshatra.name} P${planet.nakshatra.pada}`, LEFT_X + 370, yLeft);

      yLeft += ROW_H;
    });

    // ============ BOTTOM-RIGHT: HOUSES ============
    let yRightBottom = BOTTOM_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Chi tiết các nhà:', RIGHT_X, yRightBottom);
    yRightBottom += 30;

    // Table header
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Nhà', RIGHT_X, yRightBottom);
    ctx.fillText('Tên', RIGHT_X + 60, yRightBottom);
    ctx.fillText('Ý nghĩa', RIGHT_X + 220, yRightBottom);
    ctx.fillText('Cung', RIGHT_X + 430, yRightBottom);
    ctx.fillText('HT', RIGHT_X + 500, yRightBottom);
    yRightBottom += 28;

    // House rows
    ctx.font = '16px Arial';
    chartData.houses.forEach((house) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${house.number}`, RIGHT_X, yRightBottom);
      ctx.fillText(HOUSE_NAMES[house.number]?.sanskrit || '', RIGHT_X + 60, yRightBottom);

      const meaning = HOUSE_NAMES[house.number]?.meaning || '';
      const meaningShort = meaning.length > 18 ? meaning.substring(0, 16) + '..' : meaning;
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.fillText(meaningShort, RIGHT_X + 220, yRightBottom);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#333';

      ctx.fillText(ZODIAC_SIGNS[house.sign], RIGHT_X + 430, yRightBottom);

      const planetSymbols = house.planets.map(planetId => {
        const planet = chartData.planets.find(p => p.id === planetId);
        return planet ? planet.symbol : '';
      }).join(' ');
      ctx.fillText(planetSymbols, RIGHT_X + 500, yRightBottom);

      yRightBottom += ROW_H;
    });

    // ============ FOOTER ============
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}`, fullWidth / 2, fullHeight - 30);

    // Download
    return new Promise((resolve, reject) => {
      fullCanvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = userData?.name
            ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.png`
            : 'vedic-birth-chart.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png', 0.95);
    });

  } catch (error) {
    console.error('Error generating PNG:', error);
    throw new Error(`Không thể tạo file PNG: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  }
}

// Direct PNG download removed - use downloadAsPNG with Grid 2x2 layout

