/**
 * SVG Generators for PDF Charts
 * Tạo SVG strings cho các biểu đồ South Indian để convert sang Base64 cho PDF
 */

import { PdfPlanet, PdfHouse, PdfVargaPlanet } from './types';

// Zodiac signs short (Vietnamese with diacritics)
const ZODIAC_SIGNS_SHORT = [
  'Ma', 'Kim', 'Song', 'Cua', 'Su', 'Xuong',
  'Thien', 'Hinh', 'Nhan', 'MaK', 'Bao', 'Duong'
];

// Zodiac signs full Vietnamese
const ZODIAC_SIGNS_FULL = [
  'Bach Duong', 'Kim Nguu', 'Song Tu', 'Cu Giai', 'Su Tu', 'Xuong Nu',
  'Thien Xa', 'Thien Hinh', 'Nhan Ma', 'Ma Ket', 'Bao Phuong', 'Duong Phu'
];

// Planet short names
const PLANET_SHORT: Record<string, string> = {
  'Sun': 'Mt', 'Moon': 'Mt', 'Mars': 'Hoa', 'Mercury': 'Thuy',
  'Jupiter': 'Moc', 'Venus': 'Kim', 'Saturn': 'Tho',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'TV', 'Neptune': 'HV', 'Pluto': 'DV'
};

// Planet full names (Vietnamese with diacritics)
const PLANET_NAMES: Record<string, string> = {
  'Sun': 'Mat Troi', 'Moon': 'Mat Trang', 'Mars': 'Hoa Tin',
  'Mercury': 'Thuy Tin', 'Jupiter': 'Moc Tin', 'Venus': 'Kim Tin',
  'Saturn': 'Tho Tin', 'Rahu': 'Rahu', 'Ketu': 'Ketu',
  'Uranus': 'Thien Vuong', 'Neptune': 'Hai Vuong', 'Pluto': 'Diem Vuong'
};

// South Indian chart positions (row, col) - 4x4 grid
const POSITIONS = [
  [0, 1], [0, 2], [0, 3], [1, 3],
  [2, 3], [3, 3], [3, 2], [3, 1],
  [3, 0], [2, 0], [1, 0], [0, 0]
];

// Colors matching PDF style
const BROWN = '#8B4513';
const BROWN_PALE = '#DEB887';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

/**
 * Format degree for display
 */
function formatDegree(longitude: number): string {
  const totalDegrees = longitude % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
}

/**
 * Get planet short name
 */
function getPlanetShort(name: string): string {
  return PLANET_SHORT[name] || name.substring(0, 2);
}

/**
 * Generate South Indian Chart SVG for Main Chart
 * Optimized to fit within border with minimal padding
 */
export function generateMainChartSVG(
  ascendant: number,
  planets: PdfPlanet[],
  houses: PdfHouse[],
  size: number = 600
): string {
  // Calculate ascendant sign
  const ascSign = Math.floor(ascendant / 30);
  const getHouseNumber = (signIndex: number) => ((signIndex - ascSign + 12) % 12) + 1;

  // Map planets to houses
  const planetsByHouse = planets.reduce((acc: Record<number, PdfPlanet[]>, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) acc[houseNumber] = [];
    acc[houseNumber].push(planet);
    return acc;
  }, {});

  // Grid settings - minimal padding for maximum fill
  const gridSize = size / 4;
  const offsetX = 0;
  const offsetY = 0;

  // Font sizes - adjusted for better spacing
  const signFontSize = size * 0.026;
  const ascFontSize = size * 0.018;
  const planetFontSize = size * 0.018;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect x="0" y="0" width="${size}" height="${size}" fill="${WHITE}"/>
    <g transform="translate(${offsetX}, ${offsetY})">`;

  // Draw grid cells
  for (let index = 0; index < 12; index++) {
    const [row, col] = POSITIONS[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];
    const isAscendant = houseNumber === 1;

    const x = col * gridSize;
    const y = row * gridSize;

    // Cell border
    svg += `<rect x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" fill="none" stroke="${BROWN}" stroke-width="2"/>`;

    // Sign name - top of cell
    svg += `<text x="${x + gridSize * 0.1}" y="${y + gridSize * 0.12}" font-size="${signFontSize}" fill="${BROWN}" font-weight="bold" font-family="Arial" text-anchor="middle">${ZODIAC_SIGNS_SHORT[signIndex]}</text>`;

    // House number - below sign name
    svg += `<text x="${x + gridSize * 0.1}" y="${y + gridSize * 0.22}" font-size="${signFontSize * 0.8}" fill="${BROWN}" font-family="Arial" text-anchor="middle">Nha ${houseNumber}</text>`;

    // ASC coordinates
    if (isAscendant) {
      svg += `<text x="${x + 4}" y="${y + gridSize * 0.3}" font-size="${ascFontSize}" fill="${BROWN}" font-family="Arial">MC ${formatDegree(ascendant)}</text>`;
    }

    // Planets - with increased spacing
    const planetStartY = isAscendant ? gridSize * 0.38 : gridSize * 0.32;
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + planetStartY + idx * (gridSize * 0.14);
      const suffix = planet.retrograde ? 'N' : '';
      svg += `<text x="${x + 4}" y="${planetY}" font-size="${planetFontSize}" fill="${BLACK}" font-family="Arial">${getPlanetShort(planet.name)}${suffix}</text>`;
    });
  }

  // Center - Logo image
  const centerX = size / 2;
  const centerY = size / 2;
  const logoSize = gridSize * 0.6;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${logoSize / 2 + 5}" fill="${BROWN_PALE}" stroke="${BROWN}" stroke-width="2"/>`;
  svg += `<image href="/images/logo.png" x="${centerX - logoSize / 2}" y="${centerY - logoSize / 2}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>`;

  svg += '</g></svg>';
  return svg;
}

/**
 * Generate Mini Chart SVG for Varga Charts
 */
export function generateMiniChartSVG(
  planets: PdfVargaPlanet[],
  ascendantSign: number,
  size: number = 180
): string {
  const getHouseNumber = (signIndex: number) => ((signIndex - ascendantSign + 12) % 12) + 1;

  // Map planets to houses
  const planetsByHouse = planets.reduce((acc: Record<number, PdfVargaPlanet[]>, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) acc[houseNumber] = [];
    acc[houseNumber].push(planet);
    return acc;
  }, {});

  // Grid settings
  const gridSize = size / 4;
  const offsetX = gridSize * 0.5;
  const offsetY = gridSize * 0.5;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect x="0" y="0" width="${size}" height="${size}" fill="${WHITE}"/>
    <g transform="translate(${offsetX}, ${offsetY})">`;

  // Draw grid cells
  for (let index = 0; index < 12; index++) {
    const [row, col] = POSITIONS[index];
    const signIndex = index;
    const houseNumber = getHouseNumber(signIndex);
    const planetsInHouse = planetsByHouse[houseNumber] || [];

    const x = col * gridSize;
    const y = row * gridSize;

    // Cell border - thin
    svg += `<rect x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" fill="none" stroke="${BROWN}" stroke-width="0.5"/>`;

    // Sign name - top of cell
    svg += `<text x="${x + gridSize * 0.5}" y="${y + gridSize * 0.25}" font-size="${size * 0.026}" fill="${BROWN}" font-weight="bold" font-family="Arial" text-anchor="middle">${ZODIAC_SIGNS_SHORT[signIndex]}</text>`;

    // House number - below sign
    svg += `<text x="${x + gridSize * 0.5}" y="${y + gridSize * 0.4}" font-size="${size * 0.022}" fill="${BROWN}" font-family="Arial" text-anchor="middle">N${houseNumber}</text>`;

    // Planets
    planetsInHouse.slice(0, 2).forEach((planet, idx) => {
      const planetY = y + gridSize * (0.6 + idx * 0.2);
      const suffix = planet.retrograde ? 'N' : '';
      svg += `<text x="${x + gridSize * 0.1}" y="${planetY}" font-size="${size * 0.022}" fill="${BLACK}" font-family="Arial">${getPlanetShort(planet.name)}${suffix}</text>`;
    });
  }

  svg += '</g></svg>';
  return svg;
}

/**
 * Convert SVG string to Base64 PNG data URL
 */
export async function svgToBase64PNG(svgString: string, size: number = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scale = 3; // High resolution
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }
    
    ctx.scale(scale, scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.crossOrigin = 'anonymous';
    img.src = svgUrl;
  });
}

/**
 * Generate all chart images for PDF
 */
export async function generatePDFChartImages(
  ascendant: number,
  planets: PdfPlanet[],
  houses: PdfHouse[],
  vargas: Array<{ id: string; planets: PdfVargaPlanet[]; ascendantSign: number }>
): Promise<{
  mainChartImage: string;
  vargaChartImages: Record<string, string>;
}> {
  // Generate main chart SVG
  const mainSvg = generateMainChartSVG(ascendant, planets, houses, 600);
  const mainChartImage = await svgToBase64PNG(mainSvg, 600);

  // Generate varga chart images in parallel
  const vargaPromises = vargas.map(async (varga) => {
    const vargaSvg = generateMiniChartSVG(varga.planets, varga.ascendantSign, 200);
    const vargaImage = await svgToBase64PNG(vargaSvg, 200);
    return { key: varga.id, image: vargaImage };
  });

  const vargaResults = await Promise.all(vargaPromises);
  const vargaChartImages: Record<string, string> = {};
  vargaResults.forEach(({ key, image }) => {
    vargaChartImages[key] = image;
  });

  return { mainChartImage, vargaChartImages };
}
