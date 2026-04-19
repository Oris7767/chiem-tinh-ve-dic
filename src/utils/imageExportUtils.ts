// Re-export all export functions
export { downloadAsPDF } from './pdfExportUtils';
export { downloadAsPNG } from './pngExportUtils';

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

// HTML Export
export function createStyledHTML(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): string {
  const formatBirthInfo = () => {
    if (!userData) return '';
    const parts = [];
    if (userData.birthDate) {
      parts.push(new Date(userData.birthDate).toLocaleDateString('vi-VN'));
    }
    if (userData.birthTime) parts.push(userData.birthTime);
    if (userData.location) parts.push(userData.location);
    return parts.join(' - ');
  };

  const formatDegree = (longitude: number): string => {
    const totalDegrees = longitude % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getZodiacSign = (signIndex: number): string => {
    return ZODIAC_SIGNS[signIndex] || 'Unknown';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fef7cd; padding: 20px; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #B45309; color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .header p { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 20px; color: #B45309; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #B45309; display: inline-block; }
        .table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .table th { background: #B45309; color: white; padding: 15px 10px; font-weight: 600; text-align: left; font-size: 14px; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
        .table tr:nth-child(even) { background: #f9f9f9; }
        .table tr:hover { background: #f0f8ff; }
        .planet-symbol { font-weight: bold; font-size: 16px; }
        .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
        @media (max-width: 768px) { .table { font-size: 11px; } .table th, .table td { padding: 8px 5px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vedic Birth Chart${userData?.name ? ` - ${userData.name}` : ''}</h1>
          ${userData ? `<p>${formatBirthInfo()}</p>` : ''}
        </div>
        <div class="content">
          <div class="section">
            <h2 class="section-title">Chi tiết các hành tinh (Graha)</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Hành tinh</th>
                  <th>Tên Sanskrit</th>
                  <th>Cung</th>
                  <th>Vị trí</th>
                  <th>Nhà</th>
                  <th>Nakshatra</th>
                  <th>Pada</th>
                </tr>
              </thead>
              <tbody>
                ${chartData.planets.map(planet => `
                  <tr>
                    <td><span class="planet-symbol" style="color: ${planet.color}">${planet.symbol} ${planet.name}</span></td>
                    <td>${VEDIC_PLANET_NAMES[planet.name] || planet.name}</td>
                    <td>${getZodiacSign(planet.sign)}</td>
                    <td>${formatDegree(planet.longitude)}</td>
                    <td>${planet.house}</td>
                    <td>${planet.nakshatra.name}</td>
                    <td>${planet.nakshatra.pada}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="section">
            <h2 class="section-title">Chi tiết các nhà (Bhava)</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Nhà</th>
                  <th>Tên Sanskrit</th>
                  <th>Ý Nghĩa</th>
                  <th>Cung</th>
                  <th>Hành tinh</th>
                </tr>
              </thead>
              <tbody>
                ${chartData.houses.map(house => {
                  const houseInfo = HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES];
                  const planetSymbols = house.planets.map(planetId => {
                    const planet = chartData.planets.find(p => p.id === planetId);
                    return planet ? planet.symbol : '';
                  }).join(' ');
                  return `
                    <tr>
                      <td><strong>${house.number}</strong></td>
                      <td>${houseInfo.sanskrit}</td>
                      <td>${houseInfo.meaning}</td>
                      <td>${getZodiacSign(house.sign)}</td>
                      <td>${planetSymbols}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="section">
            <h2 class="section-title">Vimshottari Dasha</h2>
            ${chartData.dashas?.current ? `
              <p><strong>Chu kỳ hiện tại:</strong> ${getViPlanetName(chartData.dashas.current.planet)}</p>
              <p><strong>Thời gian:</strong> ${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}</p>
              <p><strong>Đã qua:</strong> ${chartData.dashas.current.elapsed?.years || 0} năm, ${chartData.dashas.current.elapsed?.months || 0} tháng</p>
              <p><strong>Còn lại:</strong> ${chartData.dashas.current.remaining?.years || 0} năm, ${chartData.dashas.current.remaining?.months || 0} tháng</p>
            ` : ''}
          </div>
        </div>
        <div class="footer">
          <p>Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Download HTML
export async function downloadAsHTML(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting HTML generation...');
    const htmlContent = createStyledHTML(chartData, userData);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = userData?.name
      ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.html`
      : 'vedic-birth-chart.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('HTML file downloaded successfully');
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw new Error(`Không thể tạo file HTML: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  }
}
