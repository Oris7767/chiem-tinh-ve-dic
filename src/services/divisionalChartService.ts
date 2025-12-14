import { Planet, House, VedicChartData } from '@/components/VedicAstrology/VedicChart';

// Divisional chart types
export type DivisionalChartType = 'D1' | 'D2' | 'D3' | 'D4' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D60';

// Divisional chart configuration
export interface DivisionalChartConfig {
  type: DivisionalChartType;
  name: string;
  description: string;
  division: number; // Number of divisions per sign
}

export const DIVISIONAL_CHART_CONFIGS: Record<DivisionalChartType, DivisionalChartConfig> = {
  D1: { type: 'D1', name: 'Rashi Chart', description: 'Bản đồ chính', division: 1 },
  D2: { type: 'D2', name: 'Hora', description: 'Tài sản', division: 2 },
  D3: { type: 'D3', name: 'Dreshkana', description: 'Anh chị em', division: 3 },
  D4: { type: 'D4', name: 'Chaturthamsa', description: 'Bất động sản', division: 4 },
  D9: { type: 'D9', name: 'Navamsa', description: 'Hôn nhân', division: 9 },
  D10: { type: 'D10', name: 'Dashamsa', description: 'Sự nghiệp', division: 10 },
  D12: { type: 'D12', name: 'Dwadashamsa', description: 'Cha mẹ', division: 12 },
  D16: { type: 'D16', name: 'Shodashamsa', description: 'Xe cộ', division: 16 },
  D20: { type: 'D20', name: 'Vimsamsa', description: 'Tôn giáo', division: 20 },
  D24: { type: 'D24', name: 'Chaturvimsamsa', description: 'Học vấn', division: 24 },
  D27: { type: 'D27', name: 'Saptavimsamsa', description: 'Sức mạnh', division: 27 },
  D30: { type: 'D30', name: 'Trimsamsa', description: 'Bất hạnh', division: 30 },
  D60: { type: 'D60', name: 'Shashtiamsa', description: 'Nghiệp quả', division: 60 }
};

/**
 * Calculate divisional chart from base chart data
 * @param baseChartData - The D1 (Rashi) chart data
 * @param chartType - Type of divisional chart to calculate
 * @returns Divisional chart data
 */
export function calculateDivisionalChart(
  baseChartData: VedicChartData,
  chartType: DivisionalChartType
): VedicChartData {
  const config = DIVISIONAL_CHART_CONFIGS[chartType];
  
  // For D1, return the original chart
  if (chartType === 'D1') {
    return baseChartData;
  }

  // Calculate divisional planets
  const divisionalPlanets: Planet[] = baseChartData.planets.map(planet => {
    const divisionalPosition = calculateDivisionalPosition(planet.longitude, config.division);
    
    return {
      ...planet,
      longitude: divisionalPosition.longitude,
      sign: divisionalPosition.sign,
      house: 0 // Will be recalculated based on ascendant
    };
  });

  // Calculate divisional ascendant
  const divisionalAscendant = calculateDivisionalPosition(baseChartData.ascendant, config.division);
  
  // Recalculate house positions based on divisional ascendant
  // Houses are calculated from the new ascendant, each house is 30 degrees apart
  const housesWithPlanets = recalculateHouses([], divisionalPlanets, divisionalAscendant.longitude);
  
  // Assign planets to houses
  const planetsWithHouses = divisionalPlanets.map(planet => ({
    ...planet,
    house: getHouseForPlanet(planet.longitude, housesWithPlanets, divisionalAscendant.longitude)
  }));

  // Update houses with planet IDs
  const housesWithPlanetIds = housesWithPlanets.map(house => ({
    ...house,
    planets: planetsWithHouses
      .filter(p => p.house === house.number)
      .map(p => p.id)
  }));

  return {
    ...baseChartData,
    ascendant: divisionalAscendant.longitude,
    ascendantNakshatra: baseChartData.ascendantNakshatra, // Keep original nakshatra info
    planets: planetsWithHouses,
    houses: housesWithPlanetIds
  };
}

/**
 * Calculate divisional position from longitude
 * @param longitude - Original longitude (0-360)
 * @param division - Number of divisions per sign
 * @returns New longitude and sign
 */
function calculateDivisionalPosition(longitude: number, division: number): { longitude: number; sign: number } {
  // Normalize longitude to 0-360
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  
  // Get original sign (0-11)
  const originalSign = Math.floor(normalizedLongitude / 30);
  
  // Get position within the sign (0-30 degrees)
  const positionInSign = normalizedLongitude % 30;
  
  // Calculate which division the position falls into
  const divisionSize = 30 / division;
  const divisionIndex = Math.floor(positionInSign / divisionSize);
  
  // Calculate new sign in divisional chart
  // Formula: (originalSign * division + divisionIndex) % 12
  const newSign = (originalSign * division + divisionIndex) % 12;
  
  // Calculate new longitude within the new sign
  const newPositionInSign = (positionInSign % divisionSize) * division;
  const newLongitude = newSign * 30 + newPositionInSign;
  
  return {
    longitude: newLongitude,
    sign: newSign
  };
}

/**
 * Recalculate house positions based on new ascendant
 */
function recalculateHouses(
  baseHouses: House[],
  planets: Planet[],
  newAscendant: number
): House[] {
  // Calculate house cusps based on new ascendant
  // Each house is 30 degrees from the previous
  const houses: House[] = [];
  
  for (let i = 0; i < 12; i++) {
    const houseLongitude = (newAscendant + i * 30) % 360;
    const houseSign = Math.floor(houseLongitude / 30);
    
    houses.push({
      number: i + 1,
      longitude: houseLongitude,
      sign: houseSign,
      planets: []
    });
  }
  
  return houses;
}

/**
 * Determine which house a planet belongs to based on its longitude
 */
function getHouseForPlanet(
  planetLongitude: number,
  houses: House[],
  ascendant: number
): number {
  // Normalize longitudes
  const normalizedPlanet = ((planetLongitude % 360) + 360) % 360;
  const normalizedAsc = ((ascendant % 360) + 360) % 360;
  
  // Calculate difference from ascendant
  let difference = normalizedPlanet - normalizedAsc;
  if (difference < 0) {
    difference += 360;
  }
  
  // Each house is 30 degrees
  const houseNumber = Math.floor(difference / 30) + 1;
  
  // Return house number (1-12)
  return houseNumber > 12 ? houseNumber - 12 : houseNumber;
}

/**
 * Get all available divisional chart types (excluding D1)
 */
export function getAvailableDivisionalCharts(): DivisionalChartConfig[] {
  return Object.values(DIVISIONAL_CHART_CONFIGS).filter(config => config.type !== 'D1');
}

