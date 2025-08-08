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

export async function downloadAsPNG(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  let tempContainer: HTMLElement | null = null;
  
  try {
    // Create a temporary container
    tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1200px';
    tempContainer.style.visibility = 'hidden';
    tempContainer.innerHTML = createStyledHTML(chartData, userData);
    
    document.body.appendChild(tempContainer);
    
    // Wait for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Insert the chart SVG with better error handling
    const chartContainer = tempContainer.querySelector('#chart-container');
    const originalChart = document.getElementById('birth-chart-svg');
    
    if (chartContainer && originalChart) {
      // Wait for the original chart to be fully rendered
      if (originalChart instanceof SVGSVGElement) {
        debugSVGContent(originalChart);
        const isRendered = await waitForSVGRender(originalChart);
        
        if (!isRendered) {
          console.warn('SVG chart not fully rendered, waiting additional time...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        console.warn('Original chart is not an SVG element:', originalChart.tagName);
        // Fallback wait time if not SVG element
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const chartClone = originalChart.cloneNode(true) as SVGSVGElement;
      
      // Set explicit dimensions
      chartClone.setAttribute('width', '500');
      chartClone.setAttribute('height', '500');
      chartClone.setAttribute('viewBox', '0 0 500 500');
      
      // Remove any problematic attributes
      chartClone.removeAttribute('class');
      
      // Ensure the SVG has proper styling for rendering
      chartClone.style.display = 'block';
      chartClone.style.margin = '0 auto';
      chartClone.style.width = '500px';
      chartClone.style.height = '500px';
      chartClone.style.backgroundColor = 'white';
      
      console.log('Cloned SVG attributes:', {
        width: chartClone.getAttribute('width'),
        height: chartClone.getAttribute('height'),
        viewBox: chartClone.getAttribute('viewBox'),
        children: chartClone.children.length
      });
      
      chartContainer.appendChild(chartClone);
      
      console.log('SVG chart cloned successfully for PNG export');
    } else {
      console.warn('Chart SVG not found, proceeding without chart visualization');
      if (chartContainer) {
        chartContainer.innerHTML = '<div style="width: 500px; height: 500px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #666;">Biểu đồ sao không khả dụng</div>';
      }
    }
    
    // Wait more time for SVG to render completely
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const canvas = await html2canvas(tempContainer, {
      width: 1200,
      height: tempContainer.scrollHeight,
      scale: 1.5, // Reduced scale to avoid memory issues
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fef7cd',
      logging: true, // Enable logging for debugging
      removeContainer: false,
      foreignObjectRendering: false, // Disable foreign object rendering for better compatibility
      onclone: (clonedDoc) => {
        // Ensure SVG elements are properly styled in the cloned document
        const svgElements = clonedDoc.querySelectorAll('svg');
        svgElements.forEach(svg => {
          svg.style.display = 'block';
          svg.style.width = svg.getAttribute('width') || '500px';
          svg.style.height = svg.getAttribute('height') || '500px';
        });
        console.log('Cloned document prepared with', svgElements.length, 'SVG elements');
      },
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
      }
    });
    
    // Verify canvas has content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas không có nội dung. Vui lòng thử lại.');
    }
    
    // Debug canvas content
    console.log('Canvas created:', {
      width: canvas.width,
      height: canvas.height,
      dataURL: canvas.toDataURL().substring(0, 50) + '...'
    });
    
    // Check if canvas is mostly empty (white/transparent)
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
    let hasContent = false;
    if (imageData) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        // Check if pixel is not white/transparent
        if (!(r > 250 && g > 250 && b > 250) && a > 0) {
          hasContent = true;
          break;
        }
      }
    }
    console.log('Canvas has visible content:', hasContent);
    
    // Convert to blob and download
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
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
          
          console.log(`PNG file downloaded successfully: ${fileName}, size: ${blob.size} bytes`);
          resolve();
        } else {
          reject(new Error('Failed to create blob from canvas or blob is empty'));
        }
      }, 'image/png', 0.9);
    });
    
  } catch (error) {
    console.error('Error generating PNG:', error);
    throw new Error(`Không thể tạo file PNG: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại hoặc sử dụng tùy chọn SVG.`);
  } finally {
    if (tempContainer && tempContainer.parentNode) {
      document.body.removeChild(tempContainer);
    }
  }
}

export async function downloadAsPDF(
  chartData: VedicChartData,
  userData?: BirthDataFormValues | null
): Promise<void> {
  let tempContainer: HTMLElement | null = null;
  
  try {
    // Create a temporary container
    tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1200px';
    tempContainer.style.visibility = 'hidden';
    tempContainer.innerHTML = createStyledHTML(chartData, userData);
    
    document.body.appendChild(tempContainer);
    
    // Wait for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Insert the chart SVG with better error handling
    const chartContainer = tempContainer.querySelector('#chart-container');
    const originalChart = document.getElementById('birth-chart-svg');
    
    if (chartContainer && originalChart) {
      // Wait for the original chart to be fully rendered
      if (originalChart instanceof SVGSVGElement) {
        debugSVGContent(originalChart);
        const isRendered = await waitForSVGRender(originalChart);
        
        if (!isRendered) {
          console.warn('SVG chart not fully rendered, waiting additional time...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        console.warn('Original chart is not an SVG element:', originalChart.tagName);
        // Fallback wait time if not SVG element
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const chartClone = originalChart.cloneNode(true) as SVGSVGElement;
      
      // Set explicit dimensions
      chartClone.setAttribute('width', '500');
      chartClone.setAttribute('height', '500');
      chartClone.setAttribute('viewBox', '0 0 500 500');
      
      // Remove any problematic attributes
      chartClone.removeAttribute('class');
      
      // Ensure the SVG has proper styling for rendering
      chartClone.style.display = 'block';
      chartClone.style.margin = '0 auto';
      chartClone.style.width = '500px';
      chartClone.style.height = '500px';
      chartClone.style.backgroundColor = 'white';
      
      console.log('Cloned SVG attributes:', {
        width: chartClone.getAttribute('width'),
        height: chartClone.getAttribute('height'),
        viewBox: chartClone.getAttribute('viewBox'),
        children: chartClone.children.length
      });
      
      chartContainer.appendChild(chartClone);
      
      console.log('SVG chart cloned successfully for PDF export');
    } else {
      console.warn('Chart SVG not found, proceeding without chart visualization');
      if (chartContainer) {
        chartContainer.innerHTML = '<div style="width: 500px; height: 500px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #666;">Biểu đồ sao không khả dụng</div>';
      }
    }
    
    // Wait more time for SVG to render completely
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const canvas = await html2canvas(tempContainer, {
      width: 1200,
      height: tempContainer.scrollHeight,
      scale: 1.2, // Slightly lower scale for PDF
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fef7cd',
      logging: true, // Enable logging for debugging
      removeContainer: false,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        // Ensure SVG elements are properly styled in the cloned document
        const svgElements = clonedDoc.querySelectorAll('svg');
        svgElements.forEach(svg => {
          svg.style.display = 'block';
          svg.style.width = svg.getAttribute('width') || '500px';
          svg.style.height = svg.getAttribute('height') || '500px';
        });
        console.log('Cloned document prepared with', svgElements.length, 'SVG elements');
      },
      ignoreElements: (element) => {
        return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
      }
    });
    
    // Verify canvas has content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas không có nội dung. Vui lòng thử lại.');
    }
    
    // Debug canvas content
    console.log('Canvas created for PDF:', {
      width: canvas.width,
      height: canvas.height,
      dataURL: canvas.toDataURL().substring(0, 50) + '...'
    });
    
    // Check if canvas is mostly empty (white/transparent)
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
    let hasContent = false;
    if (imageData) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        // Check if pixel is not white/transparent
        if (!(r > 250 && g > 250 && b > 250) && a > 0) {
          hasContent = true;
          break;
        }
      }
    }
    console.log('Canvas has visible content for PDF:', hasContent);
    
    const imgData = canvas.toDataURL('image/png', 0.9);
    
    // Verify image data is not empty
    if (!imgData || imgData === 'data:,') {
      throw new Error('Không thể tạo dữ liệu hình ảnh từ canvas.');
    }
    
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
    
    console.log(`PDF file downloaded successfully: ${fileName}`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Không thể tạo file PDF: ${error.message || 'Lỗi không xác định'}`);
  } finally {
    if (tempContainer && tempContainer.parentNode) {
      document.body.removeChild(tempContainer);
    }
  }
} 