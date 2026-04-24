/**
 * SVG Generators for PDF Charts
 * Tạo SVG strings cho các biểu đồ South Indian để convert sang Base64 cho PDF
 */

import { PdfPlanet, PdfHouse, PdfVargaPlanet } from './types';

// Zodiac signs short
const ZODIAC_SIGNS_SHORT = [
  'Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi',
  'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'
];

// Planet short names
const PLANET_SHORT: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
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
    const isAscendant = houseNumber === 1;

    const x = col * gridSize;
    const y = row * gridSize;

    // Cell border
    svg += `<rect x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" fill="none" stroke="${BROWN}" stroke-width="2"/>`;

    // Sign and house number
    svg += `<text x="${x + 8}" y="${y + 24}" font-size="${size * 0.03}" fill="${BROWN}" font-weight="bold" font-family="Arial">${ZODIAC_SIGNS_SHORT[signIndex]} ${houseNumber}</text>`;

    // ASC coordinates
    if (isAscendant) {
      svg += `<text x="${x + 8}" y="${y + 45}" font-size="${size * 0.022}" fill="${BROWN}" font-family="Arial">ASC ${formatDegree(ascendant)}</text>`;
    }

    // Planets
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + 65 + idx * 22;
      const suffix = planet.retrograde ? 'R' : '';
      svg += `<text x="${x + 8}" y="${planetY}" font-size="${size * 0.022}" fill="${BLACK}" font-family="Arial">${getPlanetShort(planet.name)}${suffix} ${formatDegree(planet.longitude)}</text>`;
    });
  }

  // Center - draw a simple decorative element
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = gridSize * 0.8;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerSize / 2}" fill="${BROWN_PALE}" stroke="${BROWN}" stroke-width="2"/>`;
  svg += `<text x="${centerX}" y="${centerY + 5}" font-size="${size * 0.025}" fill="${BROWN}" font-family="Arial" text-anchor="middle">☸</text>`;

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

    // Sign and house number - scaled
    svg += `<text x="${x + gridSize * 0.1}" y="${y + gridSize * 0.2}" font-size="${size * 0.028}" fill="${BROWN}" font-family="Arial">${ZODIAC_SIGNS_SHORT[signIndex]}${houseNumber}</text>`;

    // Planets
    planetsInHouse.slice(0, 3).forEach((planet, idx) => {
      const planetY = y + gridSize * (0.4 + idx * 0.22);
      const suffix = planet.retrograde ? 'R' : '';
      svg += `<text x="${x + gridSize * 0.1}" y="${planetY}" font-size="${size * 0.024}" fill="${BLACK}" font-family="Arial">${getPlanetShort(planet.name)}${suffix}</text>`;
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
