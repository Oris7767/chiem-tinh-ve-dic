import jsPDF from 'jspdf';
import { VedicChartData } from './svgExportUtils';

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

// Helper functions
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

// SVG to Canvas converter (inline for self-contained module)
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

      // Clean up
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

// Grid 2x2 PDF Layout
// Top-Left: Chart | Top-Right: Dasha
// Bottom-Left: Planets | Bottom-Right: Houses
export async function downloadAsPDF(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting PDF generation...');

    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('Biểu đồ chưa được tải. Vui lòng đợi và thử lại.');
    }

    // Wait for SVG to render
    const startTime = Date.now();
    while (Date.now() - startTime < 3000) {
      if (svgElement.children.length > 0) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const chartCanvas = await svgToCanvas(originalChart, 500, 500);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const scale = 3;
    const contentWidth = 595;
    const contentHeight = 842;

    // Grid positions
    const TOP_Y = 60;
    const BOTTOM_Y = 350;
    const LEFT_X = 25;
    const RIGHT_X = 300;
    const ROW_H = 14;

    const canvas1 = document.createElement('canvas');
    canvas1.width = contentWidth * scale;
    canvas1.height = contentHeight * scale;
    const ctx = canvas1.getContext('2d');

    if (!ctx) throw new Error('Cannot create canvas context');
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    // Header
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    const title = userData?.name ? `Vedic Birth Chart - ${userData.name}` : 'Vedic Birth Chart';
    ctx.fillText(title, contentWidth / 2, 25);

    if (userData) {
      ctx.font = '10px Arial';
      ctx.fillStyle = '#666';
      const birthInfo = [
        userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '',
        userData.birthTime || '',
        userData.location || ''
      ].filter(Boolean).join(' | ');
      ctx.fillText(birthInfo, contentWidth / 2, 38);
    }

    // Separator line
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(25, 48);
    ctx.lineTo(contentWidth - 25, 48);
    ctx.stroke();

    // ============ TOP-LEFT: CHART ============
    ctx.drawImage(chartCanvas, LEFT_X, TOP_Y, 260, 260);

    // ============ TOP-RIGHT: DASHA ============
    let yRight = TOP_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Vimshottari Dasha hiện tại:', RIGHT_X, yRight);
    yRight += 12;

    if (chartData.dashas?.current) {
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(getViPlanetName(chartData.dashas.current.planet), RIGHT_X, yRight);
      yRight += 10;

      ctx.font = '9px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(`${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, RIGHT_X, yRight);
      yRight += 10;

      ctx.fillText(`Đã qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m`, RIGHT_X, yRight);
      ctx.fillText(`Còn lại: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m`, RIGHT_X + 130, yRight);
      yRight += 12;

      // Antardasha
      const antardasha = chartData.dashas.current.antardasha?.current;
      if (antardasha && antardasha.startDate && antardasha.endDate) {
        ctx.fillStyle = '#B45309';
        ctx.font = 'bold 9px Arial';
        ctx.fillText(`Tiểu vận: ${getViPlanetName(antardasha.planet)}`, RIGHT_X, yRight);
        yRight += 10;

        ctx.fillStyle = '#666';
        ctx.font = '9px Arial';
        ctx.fillText(`${formatDate(antardasha.startDate)} - ${formatDate(antardasha.endDate)}`, RIGHT_X, yRight);
        yRight += 14;
      } else {
        yRight += 4;
      }
    }

    // Maha Dasha sequence
    yRight += 4;
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('Trật tự Maha Dasha:', RIGHT_X, yRight);
    yRight += 12;

    ctx.font = 'bold 8px Arial';
    ctx.fillText('Hành tinh', RIGHT_X, yRight);
    ctx.fillText('Bắt đầu', RIGHT_X + 100, yRight);
    ctx.fillText('Kết thúc', RIGHT_X + 180, yRight);
    yRight += 10;

    ctx.font = '9px Arial';
    chartData.dashas.sequence.forEach((dasha, index) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${index + 1}. ${getViPlanetName(dasha.planet)}`, RIGHT_X, yRight);

      ctx.fillStyle = '#666';
      ctx.font = '8px Arial';
      ctx.fillText(formatDate(dasha.startDate), RIGHT_X + 100, yRight);
      ctx.fillText(formatDate(dasha.endDate), RIGHT_X + 180, yRight);
      ctx.font = '9px Arial';

      yRight += ROW_H;
    });

    // ============ BOTTOM-LEFT: PLANETS ============
    let yLeft = BOTTOM_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Chi tiết các hành tinh:', LEFT_X, yLeft);
    yLeft += 12;

    ctx.font = 'bold 8px Arial';
    ctx.fillText('Hành tinh', LEFT_X, yLeft);
    ctx.fillText('Vị trí', LEFT_X + 65, yLeft);
    ctx.fillText('Nhà', LEFT_X + 145, yLeft);
    ctx.fillText('Nakshatra', LEFT_X + 175, yLeft);
    yLeft += 10;

    ctx.font = '9px Arial';
    chartData.planets.forEach((planet) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${planet.symbol} ${planet.name}`, LEFT_X, yLeft);

      const degrees = Math.floor(planet.longitude % 30);
      const minutes = Math.floor((planet.longitude % 30 - degrees) * 60);
      ctx.fillText(`${ZODIAC_SIGNS[planet.sign]} ${degrees}°${minutes}'`, LEFT_X + 65, yLeft);

      ctx.fillText(`${planet.house}`, LEFT_X + 145, yLeft);
      ctx.fillText(`${planet.nakshatra.name} P${planet.nakshatra.pada}`, LEFT_X + 175, yLeft);

      yLeft += ROW_H;
    });

    // ============ BOTTOM-RIGHT: HOUSES ============
    let yRightBottom = BOTTOM_Y;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('Chi tiết các nhà:', RIGHT_X, yRightBottom);
    yRightBottom += 12;

    ctx.font = 'bold 8px Arial';
    ctx.fillText('Nhà', RIGHT_X, yRightBottom);
    ctx.fillText('Tên', RIGHT_X + 30, yRightBottom);
    ctx.fillText('Ý nghĩa', RIGHT_X + 110, yRightBottom);
    ctx.fillText('Cung', RIGHT_X + 200, yRightBottom);
    ctx.fillText('HT', RIGHT_X + 245, yRightBottom);
    yRightBottom += 10;

    ctx.font = '9px Arial';
    chartData.houses.forEach((house) => {
      ctx.fillStyle = '#333';
      ctx.fillText(`${house.number}`, RIGHT_X, yRightBottom);
      ctx.fillText(HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES].sanskrit, RIGHT_X + 30, yRightBottom);

      const meaning = HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES].meaning;
      const meaningShort = meaning.length > 15 ? meaning.substring(0, 13) + '..' : meaning;
      ctx.fillStyle = '#666';
      ctx.font = '8px Arial';
      ctx.fillText(meaningShort, RIGHT_X + 110, yRightBottom);
      ctx.font = '9px Arial';
      ctx.fillStyle = '#333';

      ctx.fillText(ZODIAC_SIGNS[house.sign], RIGHT_X + 200, yRightBottom);

      const planetSymbols = house.planets.map(planetId => {
        const planet = chartData.planets.find(p => p.id === planetId);
        return planet ? planet.symbol : '';
      }).join(' ');
      ctx.fillText(planetSymbols, RIGHT_X + 245, yRightBottom);

      yRightBottom += ROW_H;
    });

    // Footer
    ctx.fillStyle = '#666';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}`, contentWidth / 2, contentHeight - 15);

    // Generate PDF
    const imgData1 = canvas1.toDataURL('image/png', 0.95);
    pdf.addImage(imgData1, 'PNG', 0, 0, pageWidth, pageHeight);

    const fileName = userData?.name
      ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.pdf`
      : 'vedic-birth-chart.pdf';

    pdf.save(fileName);
    console.log(`PDF generated successfully: ${fileName}`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Không thể tạo file PDF: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  }
}
