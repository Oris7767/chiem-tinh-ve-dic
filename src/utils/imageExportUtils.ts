import html2canvas from 'html2canvas';
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

function createStyledHTML(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): string {
  const formatBirthInfo = () => {
    if (!userData) return '';
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #fef7cd 0%, #fff8dc 100%);
          padding: 20px;
          color: #333;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #B45309 0%, #D4A574 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .content {
          padding: 30px;
        }
        
        .chart-section {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .chart-container {
          display: inline-block;
          background: #fafafa;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 20px;
          color: #B45309;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #B45309;
          display: inline-block;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .table th {
          background: linear-gradient(135deg, #B45309 0%, #D4A574 100%);
          color: white;
          padding: 15px 10px;
          font-weight: 600;
          text-align: left;
          font-size: 14px;
        }
        
        .table td {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
          font-size: 13px;
        }
        
        .table tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        .table tr:hover {
          background: #f0f8ff;
        }
        
        .planet-symbol {
          font-weight: bold;
          font-size: 16px;
        }
        
        .dasha-current {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .dasha-current h3 {
          color: #B45309;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .dasha-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }
        
        .dasha-detail {
          background: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .dasha-detail strong {
          color: #B45309;
          display: block;
          margin-bottom: 5px;
        }
        
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          color: #666;
          font-size: 12px;
        }
        
        @media (max-width: 768px) {
          .dasha-info {
            grid-template-columns: 1fr;
          }
          
          .table {
            font-size: 11px;
          }
          
          .table th, .table td {
            padding: 8px 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vedic Birth Chart${userData?.name ? ` - ${userData.name}` : ''}</h1>
          ${userData ? `<p>${formatBirthInfo()}</p>` : ''}
        </div>
        
        <div class="content">
          <div class="chart-section">
            <div class="chart-container" id="chart-container">
              <!-- Chart will be inserted here -->
            </div>
          </div>
          
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
                    <td>
                      <span class="planet-symbol" style="color: ${planet.color}">
                        ${planet.symbol} ${planet.name}
                      </span>
                    </td>
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
            <h2 class="section-title">Vimshottari Dasha (Chu kỳ hành tinh)</h2>
            
            ${chartData.dashas?.current ? `
              <div class="dasha-current">
                <h3>Chu kỳ hiện tại: ${getViPlanetName(chartData.dashas.current.planet)}</h3>
                <p><strong>Thời gian:</strong> ${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}</p>
                
                <div class="dasha-info">
                  <div class="dasha-detail">
                    <strong>Đã qua:</strong>
                    ${chartData.dashas.current.elapsed?.years || 0} năm, 
                    ${chartData.dashas.current.elapsed?.months || 0} tháng, 
                    ${chartData.dashas.current.elapsed?.days || 0} ngày
                  </div>
                  <div class="dasha-detail">
                    <strong>Còn lại:</strong>
                    ${chartData.dashas.current.remaining?.years || 0} năm, 
                    ${chartData.dashas.current.remaining?.months || 0} tháng, 
                    ${chartData.dashas.current.remaining?.days || 0} ngày
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${chartData.dashas?.sequence && chartData.dashas.sequence.length > 0 ? `
              <table class="table">
                <thead>
                  <tr>
                    <th>Hành Tinh</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Thời Gian (năm)</th>
                  </tr>
                </thead>
                <tbody>
                  ${chartData.dashas.sequence.slice(0, 10).map(dasha => `
                    <tr>
                      <td><strong>${getViPlanetName(dasha.planet)}</strong></td>
                      <td>${formatDate(dasha.startDate)}</td>
                      <td>${formatDate(dasha.endDate)}</td>
                      <td>${((new Date(dasha.endDate).getTime() - new Date(dasha.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
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

export async function downloadAsPNG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  // Create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '1200px';
  tempContainer.innerHTML = createStyledHTML(chartData, userData);
  
  document.body.appendChild(tempContainer);
  
  // Insert the chart SVG
  const chartContainer = tempContainer.querySelector('#chart-container');
  const originalChart = document.getElementById('birth-chart-svg');
  if (chartContainer && originalChart) {
    const chartClone = originalChart.cloneNode(true) as SVGSVGElement;
    chartClone.setAttribute('width', '500');
    chartClone.setAttribute('height', '500');
    chartContainer.appendChild(chartClone);
  }
  
  try {
    const canvas = await html2canvas(tempContainer, {
      width: 1200,
      height: tempContainer.scrollHeight,
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fef7cd'
    });
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        
        const fileName = userData?.name 
          ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.png`
          : 'vedic-birth-chart.png';
        
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 0.95);
    
  } catch (error) {
    console.error('Error generating PNG:', error);
    throw error;
  } finally {
    document.body.removeChild(tempContainer);
  }
}

export async function downloadAsPDF(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  // Create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '1200px';
  tempContainer.innerHTML = createStyledHTML(chartData, userData);
  
  document.body.appendChild(tempContainer);
  
  // Insert the chart SVG
  const chartContainer = tempContainer.querySelector('#chart-container');
  const originalChart = document.getElementById('birth-chart-svg');
  if (chartContainer && originalChart) {
    const chartClone = originalChart.cloneNode(true) as SVGSVGElement;
    chartClone.setAttribute('width', '500');
    chartClone.setAttribute('height', '500');
    chartContainer.appendChild(chartClone);
  }
  
  try {
    const canvas = await html2canvas(tempContainer, {
      width: 1200,
      height: tempContainer.scrollHeight,
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fef7cd'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20); // Account for margins
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }
    
    // Download PDF
    const fileName = userData?.name 
      ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.pdf`
      : 'vedic-birth-chart.pdf';
    
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    document.body.removeChild(tempContainer);
  }
} 