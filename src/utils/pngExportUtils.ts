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

// PNG Download
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
    const chartCanvas = await svgToCanvas(originalChart, 500, 500);

    const fullWidth = 1200;
    const fullHeight = 1600;
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = fullWidth;
    fullCanvas.height = fullHeight;
    const ctx = fullCanvas.getContext('2d');

    if (!ctx) throw new Error('Cannot create canvas context');

    // Background
    ctx.fillStyle = '#fef7cd';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    // Header
    ctx.fillStyle = '#B45309';
    ctx.fillRect(0, 0, fullWidth, 100);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    const title = userData?.name ? `Vedic Birth Chart - ${userData.name}` : 'Vedic Birth Chart';
    ctx.fillText(title, fullWidth / 2, 40);

    if (userData) {
      ctx.font = '16px Arial';
      const birthInfo = [
        userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '',
        userData.birthTime || '',
        userData.location || ''
      ].filter(Boolean).join(' - ');
      ctx.fillText(birthInfo, fullWidth / 2, 70);
    }

    // Chart
    const chartX = (fullWidth - 500) / 2;
    const chartY = 120;
    ctx.drawImage(chartCanvas, chartX, chartY);

    // Planet details
    let yPos = chartY + 520;

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Chi tiết các hành tinh (Graha)', 30, yPos);
    yPos += 25;

    ctx.font = 'bold 12px Arial';
    ctx.fillText('Hành tinh', 30, yPos);
    ctx.fillText('Tên Sanskrit', 120, yPos);
    ctx.fillText('Cung', 220, yPos);
    ctx.fillText('Vị trí', 280, yPos);
    ctx.fillText('Nhà', 340, yPos);
    ctx.fillText('Nakshatra', 400, yPos);
    yPos += 15;

    ctx.font = '11px Arial';
    chartData.planets.forEach((planet, index) => {
      if (yPos > fullHeight - 100) return;

      const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
      ctx.fillStyle = bgColor;
      ctx.fillRect(25, yPos - 12, fullWidth - 50, 18);

      ctx.fillStyle = '#000';
      ctx.fillText(`${planet.symbol} ${planet.name}`, 30, yPos);
      ctx.fillText(VEDIC_PLANET_NAMES[planet.name] || planet.name, 120, yPos);
      ctx.fillText(ZODIAC_SIGNS[planet.sign], 220, yPos);

      const degrees = Math.floor(planet.longitude % 30);
      const minutes = Math.floor((planet.longitude % 30 - degrees) * 60);
      ctx.fillText(`${degrees}°${minutes}'`, 280, yPos);
      ctx.fillText(`${planet.house}`, 340, yPos);
      ctx.fillText(planet.nakshatra.name, 400, yPos);

      yPos += 18;
    });

    // House details
    yPos += 20;
    if (yPos + 200 < fullHeight) {
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Chi tiết các nhà (Bhava)', 30, yPos);
      yPos += 25;

      ctx.font = 'bold 12px Arial';
      ctx.fillText('Nhà', 30, yPos);
      ctx.fillText('Tên Sanskrit', 80, yPos);
      ctx.fillText('Ý Nghĩa', 200, yPos);
      ctx.fillText('Hành tinh', 450, yPos);
      yPos += 15;

      ctx.font = '11px Arial';
      chartData.houses.forEach((house, index) => {
        if (yPos > fullHeight - 80) return;

        const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
        ctx.fillStyle = bgColor;
        ctx.fillRect(25, yPos - 12, fullWidth - 50, 18);

        ctx.fillStyle = '#000';
        ctx.fillText(`${house.number}`, 30, yPos);
        ctx.fillText(VEDIC_PLANET_NAMES[planet.name] || planet.name, 80, yPos);

        const planetSymbols = house.planets.map(planetId => {
          const planet = chartData.planets.find(p => p.id === planetId);
          return planet ? planet.symbol : '';
        }).join(' ');
        ctx.fillText(planetSymbols, 450, yPos);

        yPos += 18;
      });
    }

    // Dasha section
    if (chartData.dashas?.current) {
      yPos += 20;
      if (yPos + 100 < fullHeight) {
        ctx.fillStyle = '#B45309';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Vimshottari Dasha', 30, yPos);
        yPos += 25;

        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(25, yPos - 10, fullWidth - 50, 40);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Chu kỳ hiện tại: ${getViPlanetName(chartData.dashas.current.planet)}`, 35, yPos);

        ctx.font = '11px Arial';
        yPos += 15;
        ctx.fillText(`Thời gian: ${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, 35, yPos);
        yPos += 15;
        ctx.fillText(`Đã qua: ${chartData.dashas.current.elapsed?.years || 0} năm, ${chartData.dashas.current.elapsed?.months || 0} tháng`, 35, yPos);
        yPos += 15;
        ctx.fillText(`Còn lại: ${chartData.dashas.current.remaining?.years || 0} năm, ${chartData.dashas.current.remaining?.months || 0} tháng`, 35, yPos);
      }
    }

    // Footer
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}`, fullWidth / 2, fullHeight - 20);

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

// Direct PNG download (simplified)
export async function downloadAsPNGDirect(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('SVG chart not found');
    }

    await waitForSVGRender(originalChart, 3000);
    const svgCanvas = await svgToCanvas(originalChart, 500, 500);

    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = 1200;
    fullCanvas.height = 1600;
    const ctx = fullCanvas.getContext('2d');

    if (!ctx) throw new Error('Cannot get canvas context');

    ctx.fillStyle = '#fef7cd';
    ctx.fillRect(0, 0, 1200, 1600);

    ctx.fillStyle = '#B45309';
    ctx.fillRect(0, 0, 1200, 100);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Vedic Birth Chart${userData?.name ? ` - ${userData.name}` : ''}`, 600, 40);

    ctx.drawImage(svgCanvas, 350, 120);

    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    let yPos = 650;
    chartData.planets.forEach((planet) => {
      ctx.fillText(`${planet.symbol} ${planet.name} - Nhà ${planet.house} - ${ZODIAC_SIGNS[planet.sign]}`, 50, yPos);
      yPos += 25;
    });

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
      }, 'image/png', 0.9);
    });

  } catch (error) {
    console.error('Error in direct PNG download:', error);
    throw new Error(`Không thể tạo file PNG: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  }
}
