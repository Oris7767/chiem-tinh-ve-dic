import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VedicChartData, Planet, House } from './svgExportUtils';

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

// Utility function to wait for SVG to be fully rendered
async function waitForSVGRender(svgElement: SVGSVGElement, maxWaitTime = 5000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    // Check if SVG has content (children elements)
    if (svgElement.children.length > 0) {
      try {
        // Check if SVG has actual rendered content
        const bbox = svgElement.getBBox();
        if (bbox.width > 0 && bbox.height > 0) {
          console.log(`SVG rendered successfully: ${bbox.width}x${bbox.height}, children: ${svgElement.children.length}`);
          return true;
        }
      } catch (error) {
        // getBBox might fail if SVG is not properly rendered yet
        console.log('SVG getBBox failed, still waiting for render...');
      }
    }
    
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.warn(`SVG render timeout after ${maxWaitTime}ms. Children: ${svgElement.children.length}`);
  return false;
}

// Debug function to log SVG content
function debugSVGContent(svgElement: SVGSVGElement): void {
  console.log('SVG Debug Info:');
  console.log('- Children count:', svgElement.children.length);
  console.log('- ViewBox:', svgElement.getAttribute('viewBox'));
  console.log('- Width:', svgElement.getAttribute('width'));
  console.log('- Height:', svgElement.getAttribute('height'));
  console.log('- InnerHTML length:', svgElement.innerHTML.length);
  
  if (svgElement.children.length > 0) {
    console.log('- First child:', svgElement.children[0].tagName);
    console.log('- Last child:', svgElement.children[svgElement.children.length - 1].tagName);
  }
}

// Alternative PNG download function that works directly with SVG
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

      // Clone SVG
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      svgClone.setAttribute('width', width.toString());
      svgClone.setAttribute('height', height.toString());
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // Clean up problematic elements
      const scripts = svgClone.querySelectorAll('script');
      scripts.forEach(s => s.remove());

      const styles = svgClone.querySelectorAll('style');
      styles.forEach(s => s.remove());

      // Keep foreignObject - it's actually helpful for HTML content
      // const foreignObjects = svgClone.querySelectorAll('foreignObject');
      // foreignObjects.forEach(f => f.remove());

      const images = svgClone.querySelectorAll('image');
      images.forEach(img => {
        const href = img.getAttribute('href') || img.getAttribute('xlink:href');
        if (href && !href.startsWith('data:')) {
          console.log('Removing external image:', href);
          img.remove();
        }
      });

      // Ensure fonts are system fonts
      const textElements = svgClone.querySelectorAll('text, tspan');
      textElements.forEach(text => {
        const currentFamily = text.getAttribute('font-family');
        if (!currentFamily || currentFamily.includes('Arial') || currentFamily.includes('Helvetica')) {
          text.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        }
        const textEl = text as HTMLElement;
        textEl.style.fontFamily = 'Arial, Helvetica, sans-serif';
      });

      // Serialize SVG
      const svgData = new XMLSerializer().serializeToString(svgClone);

      // Method 1: Try direct SVG data URL
      const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

      const testImg = new Image();

      const timeout = setTimeout(() => {
        testImg.onload = null;
        testImg.onerror = null;
        reject(new Error('SVG loading timeout after 10 seconds'));
      }, 10000);

      testImg.onload = () => {
        clearTimeout(timeout);
        try {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(testImg, 0, 0, width, height);
          resolve(canvas);
        } catch (e) {
          reject(new Error('Failed to draw SVG on canvas: ' + e.message));
        }
      };

      testImg.onerror = () => {
        clearTimeout(timeout);
        console.warn('Method 1 (direct SVG) failed, trying Method 2 (foreignObject)...');

        // Method 2: Use foreignObject to embed SVG in HTML
        try {
          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { margin: 0; padding: 0; overflow: hidden; }
                svg { display: block; width: ${width}px; height: ${height}px; }
                text { font-family: Arial, Helvetica, sans-serif; }
              </style>
            </head>
            <body>
              ${svgData}
            </body>
            </html>
          `;

          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);

          const img2 = new Image();
          img2.onload = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img2, 0, 0, width, height);
            URL.revokeObjectURL(url);
            resolve(canvas);
          };

          img2.onerror = () => {
            URL.revokeObjectURL(url);
            console.warn('Method 2 (foreignObject) failed, trying Method 3 (SVG Blob)...');
            
            // Method 3: Try SVG blob URL
            try {
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
              const svgBlobUrl = URL.createObjectURL(svgBlob);
              const img3 = new Image();
              
              img3.onload = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img3, 0, 0, width, height);
                URL.revokeObjectURL(svgBlobUrl);
                resolve(canvas);
              };
              
              img3.onerror = () => {
                URL.revokeObjectURL(svgBlobUrl);
                reject(new Error('Failed to load SVG as image using all methods'));
              };
              
              img3.crossOrigin = 'anonymous';
              img3.src = svgBlobUrl;
            } catch (e) {
              reject(new Error('Failed to convert SVG to canvas: ' + e.message));
            }
          };

          img2.crossOrigin = 'anonymous';
          img2.src = url;
        } catch (e) {
          reject(new Error('Failed with foreignObject method: ' + e.message));
        }
      };

      testImg.crossOrigin = 'anonymous';
      testImg.src = svgUrl;
    } catch (error) {
      console.error('Error in svgToCanvas:', error);
      reject(error);
    }
  });
}


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
          font-family: Arial, sans-serif;
          background: #fef7cd;
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
          background: #B45309;
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
          background: #B45309;
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
          background: #fef3c7;
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

// Improved PNG download function - replaces html2canvas-based version
export async function downloadAsPNG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting PNG generation...');

    // Get the original SVG chart
    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('Biểu đồ chưa được tải. Vui lòng đợi và thử lại.');
    }

    // Wait for SVG to be fully rendered
    const isRendered = await waitForSVGRender(originalChart, 3000);
    if (!isRendered) {
      console.warn('SVG may not be fully rendered, proceeding anyway...');
    }

    // Convert SVG to canvas
    const chartCanvas = await svgToCanvas(originalChart, 500, 500);
    console.log('Chart converted to canvas:', chartCanvas.width, 'x', chartCanvas.height);

    // Create full content canvas
    const fullWidth = 1200;
    const fullHeight = 1600; // Estimated height
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = fullWidth;
    fullCanvas.height = fullHeight;
    const ctx = fullCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Cannot create canvas context');
    }

    // Fill background
    ctx.fillStyle = '#fef7cd';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    // Draw header background
    ctx.fillStyle = '#B45309';
    ctx.fillRect(0, 0, fullWidth, 100);

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    const title = userData?.name
      ? `Vedic Birth Chart - ${userData.name}`
      : 'Vedic Birth Chart';
    ctx.fillText(title, fullWidth / 2, 40);

    // Draw birth info
    if (userData) {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#ffffff';
      const birthInfo = [
        userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '',
        userData.birthTime || '',
        userData.location || ''
      ].filter(Boolean).join(' - ');
      ctx.fillText(birthInfo, fullWidth / 2, 70);
    }

    // Draw chart (centered)
    const chartX = (fullWidth - 500) / 2;
    const chartY = 120;
    ctx.drawImage(chartCanvas, chartX, chartY);

    // Draw planet details section
    let yPos = chartY + 520;

    // Section header
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Chi tiết các hành tinh (Graha)', 30, yPos);
    yPos += 25;

    // Planet table header
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Hành tinh', 30, yPos);
    ctx.fillText('Tên Sanskrit', 120, yPos);
    ctx.fillText('Cung', 220, yPos);
    ctx.fillText('Vị trí', 280, yPos);
    ctx.fillText('Nhà', 340, yPos);
    ctx.fillText('Nakshatra', 400, yPos);
    yPos += 15;

    // Draw planet rows
    ctx.font = '11px Arial';
    chartData.planets.forEach((planet, index) => {
      if (yPos > fullHeight - 100) return;

      const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
      ctx.fillStyle = bgColor;
      ctx.fillRect(25, yPos - 12, fullWidth - 50, 18);

      ctx.fillStyle = '#000';
      const planetInfo = `${planet.symbol} ${planet.name}`;
      ctx.fillText(planetInfo, 30, yPos);

      const sanskritName = VEDIC_PLANET_NAMES[planet.name] || planet.name;
      ctx.fillText(sanskritName, 120, yPos);
      ctx.fillText(ZODIAC_SIGNS[planet.sign], 220, yPos);
      const degrees = Math.floor(planet.longitude % 30);
      const minutes = Math.floor((planet.longitude % 30 - degrees) * 60);
      ctx.fillText(`${degrees}°${minutes}'`, 280, yPos);
      ctx.fillText(`${planet.house}`, 340, yPos);
      ctx.fillText(planet.nakshatra.name, 400, yPos);

      yPos += 18;
    });

    // Draw house details section
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

        const houseInfo = HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES];
        ctx.fillText(houseInfo.sanskrit, 80, yPos);

        const planetSymbols = house.planets.map(planetId => {
          const planet = chartData.planets.find(p => p.id === planetId);
          return planet ? planet.symbol : '';
        }).join(' ');
        ctx.fillText(planetSymbols, 450, yPos);

        yPos += 18;
      });
    }

    // Draw Dasha section
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
        ctx.fillText(`Đã qua: ${chartData.dashas.current.elapsed?.years || 0} năm, ${chartData.dashas.current.elapsed?.months || 0} tháng, ${chartData.dashas.current.elapsed?.days || 0} ngày`, 35, yPos);
        yPos += 15;
        ctx.fillText(`Còn lại: ${chartData.dashas.current.remaining?.years || 0} năm, ${chartData.dashas.current.remaining?.months || 0} tháng, ${chartData.dashas.current.remaining?.days || 0} ngày`, 35, yPos);
      }
    }

    // Footer
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}`, fullWidth / 2, fullHeight - 20);

    // Convert to blob and download
    return new Promise((resolve, reject) => {
      fullCanvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;

          const fileName = userData?.name
            ? `vedic-chart-${userData.name.replace(/s+/g, '-')}-${userData.birthDate || 'unknown'}.png`
            : 'vedic-birth-chart.png';

          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);

          console.log(`PNG file downloaded successfully: ${fileName}, size: ${blob.size} bytes`);
          resolve();
        } else {
          reject(new Error('Failed to create blob from canvas or blob is empty'));
        }
      }, 'image/png', 0.95);
    });

  } catch (error) {
    console.error('Error generating PNG:', error);
    throw new Error(`Không thể tạo file PNG: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại hoặc sử dụng tùy chọn SVG.`);
  }
}


// Alternative PNG download function that works directly with SVG
export async function downloadAsPNGDirect(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting direct PNG download...');
    
    // Get the original SVG
    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('SVG chart not found or not properly rendered');
    }
    
    debugSVGContent(originalChart);
    
    // Convert SVG directly to canvas
    const svgCanvas = await svgToCanvas(originalChart, 500, 500);
    
    // Create the full content canvas
    const fullCanvas = document.createElement('canvas');
    const fullWidth = 1200;
    const fullHeight = 1600; // Estimated height
    fullCanvas.width = fullWidth;
    fullCanvas.height = fullHeight;
    
    const ctx = fullCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get canvas context');
    }
    
    // Fill background
    ctx.fillStyle = '#fef7cd';
    ctx.fillRect(0, 0, fullWidth, fullHeight);
    
    // Draw header
    ctx.fillStyle = '#B45309';
    ctx.fillRect(0, 0, fullWidth, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    const title = `Vedic Birth Chart${userData?.name ? ` - ${userData.name}` : ''}`;
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
    
    // Draw SVG chart
    const chartX = (fullWidth - 500) / 2;
    const chartY = 120;
    ctx.drawImage(svgCanvas, chartX, chartY);
    
    // Add basic info text
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    let yPos = chartY + 520;
    ctx.fillText('Chi tiết biểu đồ Vedic:', 50, yPos);
    yPos += 30;
    
    // Add planet info
    chartData.planets.forEach((planet, index) => {
      if (yPos > fullHeight - 50) return; // Prevent overflow
      
      const planetInfo = `${planet.symbol} ${planet.name} - Nhà ${planet.house} - ${ZODIAC_SIGNS[planet.sign]}`;
      ctx.font = '14px Arial';
      ctx.fillText(planetInfo, 50, yPos);
      yPos += 25;
    });
    
    // Convert to blob and download
    return new Promise((resolve, reject) => {
      fullCanvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
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
          
          console.log(`Direct PNG file downloaded successfully: ${fileName}, size: ${blob.size} bytes`);
          resolve();
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png', 0.9);
    });
    
  } catch (error) {
    console.error('Error in direct PNG download:', error);
    throw new Error(`Không thể tạo file PNG: ${error.message || 'Lỗi không xác định'}`);
  }
}

// New improved PDF download function - Dashboard Layout (2 columns, single page A4)
// This directly renders everything to canvas and then to PDF
export async function downloadAsPDF(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  try {
    console.log('Starting PDF generation...');

    // Get the original SVG chart
    const originalChart = document.getElementById('birth-chart-svg');
    if (!originalChart || !(originalChart instanceof SVGSVGElement)) {
      throw new Error('Biểu đồ chưa được tải. Vui lòng đợi và thử lại.');
    }

    // Wait for SVG to be fully rendered
    const isRendered = await waitForSVGRender(originalChart, 3000);
    if (!isRendered) {
      console.warn('SVG may not be fully rendered, proceeding anyway...');
    }

    // Convert SVG to canvas (chart only - rendered on high DPI canvas)
    const chartCanvas = await svgToCanvas(originalChart, 500, 500);
    console.log('Chart converted to canvas:', chartCanvas.width, 'x', chartCanvas.height);

    // Initialize PDF (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // ============ HIGH DPI SCALING ============
    const scale = 3;

    // ============ SINGLE PAGE A4 LAYOUT ============
    // Page dimensions at 72 DPI
    const contentWidth = 595;
    const contentHeight = 842;

    // Column layout constants
    const LEFT_COL_X = 25;          // Left column start X
    const LEFT_COL_WIDTH = 260;      // Left column width
    const RIGHT_COL_X = 295;         // Right column start X
    const RIGHT_COL_WIDTH = 275;     // Right column width
    const RIGHT_COL_END = RIGHT_COL_X + RIGHT_COL_WIDTH; // 570

    // Row height constants
    const ROW_HEIGHT = 13;           // Height per row
    const HEADER_HEIGHT = 22;        // Section header height

    const canvas1 = document.createElement('canvas');
    canvas1.width = contentWidth * scale;
    canvas1.height = contentHeight * scale;
    const ctx = canvas1.getContext('2d');

    if (!ctx) throw new Error('Cannot create canvas context');

    // Apply high DPI scaling
    ctx.scale(scale, scale);

    // ============ BACKGROUND ============
    ctx.fillStyle = '#fef7cd';
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    // ============ HEADER ============
    ctx.fillStyle = '#B45309';
    ctx.fillRect(0, 0, contentWidth, 55);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    const title = userData?.name
      ? `Vedic Birth Chart - ${userData.name}`
      : 'Vedic Birth Chart';
    ctx.fillText(title, contentWidth / 2, 28);

    if (userData) {
      ctx.font = '11px Arial';
      const birthInfo = [
        userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '',
        userData.birthTime || '',
        userData.location || ''
      ].filter(Boolean).join(' - ');
      ctx.fillText(birthInfo, contentWidth / 2, 45);
    }

    // ============ LEFT COLUMN: Chart + Dasha ============
    // Draw chart (scaled down to fit column)
    const chartX = LEFT_COL_X;
    const chartY = 62;
    const chartSize = 250;
    ctx.drawImage(chartCanvas, chartX, chartY, chartSize, chartSize);

    // Current Dasha highlight box
    let yLeft = chartY + chartSize + 15;

    if (chartData.dashas?.current) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(LEFT_COL_X, yLeft, LEFT_COL_WIDTH, 70);

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Chu kỳ Vimshottari Dasha hiện tại', LEFT_COL_X + 8, yLeft + 14);

      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.fillText(`${getViPlanetName(chartData.dashas.current.planet)}`, LEFT_COL_X + 8, yLeft + 28);

      ctx.font = '9px Arial';
      ctx.fillText(`${formatDate(chartData.dashas.current.startDate)} - ${formatDate(chartData.dashas.current.endDate)}`, LEFT_COL_X + 8, yLeft + 40);
      ctx.fillText(`Đã qua: ${chartData.dashas.current.elapsed?.years || 0}y ${chartData.dashas.current.elapsed?.months || 0}m | Còn lại: ${chartData.dashas.current.remaining?.years || 0}y ${chartData.dashas.current.remaining?.months || 0}m`, LEFT_COL_X + 8, yLeft + 52);

      // Show current Antardasha if available
      if (chartData.dashas.current.antardasha?.current) {
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(LEFT_COL_X + 5, yLeft + 58, LEFT_COL_WIDTH - 10, 10);
        ctx.fillStyle = '#000';
        ctx.font = '9px Arial';
        ctx.fillText(`Tiểu vận: ${getViPlanetName(chartData.dashas.current.antardasha.current.planet)} (${formatDate(chartData.dashas.current.antardasha.current.startDate)} - ${formatDate(chartData.dashas.current.antardasha.current.endDate)})`, LEFT_COL_X + 8, yLeft + 66);
      }

      yLeft += 75;
    }

    // Dasha Sequence List (Maha Dasha grid)
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Trật tự Maha Dasha', LEFT_COL_X, yLeft);
    yLeft += 14;

    // Dasha table header
    ctx.font = 'bold 9px Arial';
    ctx.fillText('#', LEFT_COL_X, yLeft);
    ctx.fillText('Hành tinh', LEFT_COL_X + 18, yLeft);
    ctx.fillText('Bắt đầu', LEFT_COL_X + 110, yLeft);
    ctx.fillText('Kết thúc', LEFT_COL_X + 185, yLeft);
    yLeft += 12;

    // Dasha rows - compact grid (2 columns within left column)
    ctx.font = '9px Arial';
    const dashaPerRow = 2;
    chartData.dashas.sequence.forEach((dasha, index) => {
      const col = index % dashaPerRow;
      const row = Math.floor(index / dashaPerRow);
      const xPos = col === 0 ? LEFT_COL_X : LEFT_COL_X + 130;
      const yPos = yLeft + (row * ROW_HEIGHT);

      const bgColor = index % 2 === 0 ? '#fafafa' : '#fef3c7';
      ctx.fillStyle = bgColor;
      ctx.fillRect(xPos, yPos - 9, 125, ROW_HEIGHT);

      ctx.fillStyle = '#000';
      ctx.fillText(`${index + 1}. ${getViPlanetName(dasha.planet)}`, xPos, yPos);
      ctx.font = '8px Arial';
      ctx.fillText(formatDate(dasha.startDate), xPos + 2, yPos + 10);
      ctx.font = '9px Arial';
    });

    // Calculate final yLeft after dasha list
    const dashaRows = Math.ceil(chartData.dashas.sequence.length / dashaPerRow);
    yLeft += dashaRows * ROW_HEIGHT + 10;

    // ============ RIGHT COLUMN: Planet + House Details ============
    let yRight = 62;

    // Planet details section header
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Chi tiết các hành tinh (Graha)', RIGHT_COL_X, yRight);
    yRight += 14;

    // Planet table header - merged columns for compactness
    ctx.font = 'bold 9px Arial';
    ctx.fillText('Hành tinh', RIGHT_COL_X, yRight);
    ctx.fillText('Cung/Vị trí', RIGHT_COL_X + 75, yRight);
    ctx.fillText('Nhà', RIGHT_COL_X + 165, yRight);
    ctx.fillText('Nakshatra', RIGHT_COL_X + 200, yRight);
    yRight += 11;

    // Planet rows - compact
    ctx.font = '9px Arial';
    chartData.planets.forEach((planet, index) => {
      const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
      ctx.fillStyle = bgColor;
      ctx.fillRect(RIGHT_COL_X, yRight - 9, RIGHT_COL_WIDTH, ROW_HEIGHT);

      ctx.fillStyle = '#000';
      ctx.textAlign = 'left';

      // Merged: Planet symbol + name + Sanskrit
      const planetText = `${planet.symbol} ${planet.name}`;
      ctx.fillText(planetText, RIGHT_COL_X + 2, yRight);

      // Merged: Zodiac sign + degree
      const degrees = Math.floor(planet.longitude % 30);
      const minutes = Math.floor((planet.longitude % 30 - degrees) * 60);
      const signText = `${ZODIAC_SIGNS[planet.sign]} ${degrees}°${minutes}'`;
      ctx.fillText(signText, RIGHT_COL_X + 75, yRight);

      // House
      ctx.fillText(`${planet.house}`, RIGHT_COL_X + 165, yRight);

      // Nakshatra
      ctx.fillText(`${planet.nakshatra.name} P${planet.nakshatra.pada}`, RIGHT_COL_X + 200, yRight);

      yRight += ROW_HEIGHT;
    });

    yRight += 10;

    // House details section header
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Chi tiết các nhà (Bhava)', RIGHT_COL_X, yRight);
    yRight += 14;

    // House table header - compact
    ctx.font = 'bold 9px Arial';
    ctx.fillText('Nhà', RIGHT_COL_X, yRight);
    ctx.fillText('Tên', RIGHT_COL_X + 22, yRight);
    ctx.fillText('Ý nghĩa', RIGHT_COL_X + 85, yRight);
    ctx.fillText('Cung', RIGHT_COL_X + 195, yRight);
    ctx.fillText('HT', RIGHT_COL_X + 250, yRight);
    yRight += 11;

    // House rows - compact
    ctx.font = '9px Arial';
    chartData.houses.forEach((house, index) => {
      const bgColor = index % 2 === 0 ? '#fafafa' : 'white';
      ctx.fillStyle = bgColor;
      ctx.fillRect(RIGHT_COL_X, yRight - 9, RIGHT_COL_WIDTH, ROW_HEIGHT);

      ctx.fillStyle = '#000';
      ctx.textAlign = 'left';

      ctx.fillText(`${house.number}`, RIGHT_COL_X + 2, yRight);

      const houseInfo = HOUSE_NAMES[house.number as keyof typeof HOUSE_NAMES];
      ctx.fillText(houseInfo.sanskrit, RIGHT_COL_X + 22, yRight);

      // Shortened meaning (first 20 chars)
      const meaningShort = houseInfo.meaning.length > 20
        ? houseInfo.meaning.substring(0, 18) + '..'
        : houseInfo.meaning;
      ctx.font = '8px Arial';
      ctx.fillText(meaningShort, RIGHT_COL_X + 85, yRight);
      ctx.font = '9px Arial';

      ctx.fillText(ZODIAC_SIGNS[house.sign], RIGHT_COL_X + 195, yRight);

      const planetSymbols = house.planets.map(planetId => {
        const planet = chartData.planets.find(p => p.id === planetId);
        return planet ? planet.symbol : '';
      }).join(' ');
      ctx.fillText(planetSymbols, RIGHT_COL_X + 250, yRight);

      yRight += ROW_HEIGHT;
    });

    // ============ FOOTER ============
    ctx.fillStyle = '#666';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Vedic Astrology App - ${new Date().toLocaleDateString('vi-VN')}`, contentWidth / 2, contentHeight - 15);

    // ============ GENERATE PDF ============
    const imgData1 = canvas1.toDataURL('image/png', 0.95);
    pdf.addImage(imgData1, 'PNG', 0, 0, pageWidth, pageHeight);

    // Download
    const fileName = userData?.name
      ? `vedic-chart-${userData.name.replace(/\s+/g, '-')}-${userData.birthDate || 'unknown'}.pdf`
      : 'vedic-birth-chart.pdf';

    pdf.save(fileName);
    console.log(`PDF generated successfully: ${fileName}`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Không thể tạo file PDF: ${error.message || 'Lỗi không xác định'}`);
  }
}

// Helper functions for PDF generation
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch (e) {
    return dateStr;
  }
}

function getViPlanetName(planet: string): string {
  return PLANET_NAMES_VI[planet as keyof typeof PLANET_NAMES_VI] || planet;
}
 