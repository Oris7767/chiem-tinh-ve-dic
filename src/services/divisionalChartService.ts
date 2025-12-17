import { Planet, House, VedicChartData } from '@/components/VedicAstrology/VedicChart';

// Divisional chart types
export type DivisionalChartType = 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

// Divisional chart configuration based on Parashara system
export interface DivisionalChartConfig {
  type: DivisionalChartType;
  name: string;
  description: string;
  divisions: number;
  method: string;
}

export const DIVISIONAL_CHART_CONFIGS: Record<DivisionalChartType, DivisionalChartConfig> = {
  D1: { type: 'D1', name: 'Rashi', description: 'Cung gốc (Root Chart), Thân thể', divisions: 1, method: 'simple' },
  D2: { type: 'D2', name: 'Hora', description: 'Tài sản, Gia đình', divisions: 2, method: 'odd_even_fixed' },
  D3: { type: 'D3', name: 'Drekkana', description: 'Anh chị em, lòng dũng cảm', divisions: 3, method: 'trine_jump' },
  D4: { type: 'D4', name: 'Chaturthamsa', description: 'Nhà cửa, Bất động sản', divisions: 4, method: 'cycle_start_current' },
  D7: { type: 'D7', name: 'Saptamsa', description: 'Con cái', divisions: 7, method: 'odd_even_start' },
  D9: { type: 'D9', name: 'Navamsa', description: 'Hôn nhân, Sức mạnh chung', divisions: 9, method: 'modality_based' },
  D10: { type: 'D10', name: 'Dasamsa', description: 'Sự nghiệp, Danh vọng', divisions: 10, method: 'odd_even_start' },
  D12: { type: 'D12', name: 'Dwadasamsa', description: 'Cha mẹ', divisions: 12, method: 'cycle_start_current' },
  D16: { type: 'D16', name: 'Shodasamsa', description: 'Xe cộ, Hạnh phúc', divisions: 16, method: 'modality_based_fixed_start' },
  D20: { type: 'D20', name: 'Vimsamsa', description: 'Tâm linh, Sự sùng tín', divisions: 20, method: 'modality_based_fixed_start' },
  D24: { type: 'D24', name: 'Siddhamsa', description: 'Học vấn, Kiến thức', divisions: 24, method: 'odd_even_fixed_start' },
  D27: { type: 'D27', name: 'Bhamsa (Nakshatramsa)', description: 'Sức mạnh, Điểm yếu', divisions: 27, method: 'element_based_fixed_start' },
  D30: { type: 'D30', name: 'Trimsamsa', description: 'Vận hạn, Bất hạnh', divisions: 30, method: 'custom_degrees_mapping' },
  D40: { type: 'D40', name: 'Khavedamsa', description: 'May mắn/Bất hạnh (Chi tiết)', divisions: 40, method: 'odd_even_fixed_start' },
  D45: { type: 'D45', name: 'Akshavedamsa', description: 'Tổng quát mọi vấn đề', divisions: 45, method: 'modality_based_fixed_start' },
  D60: { type: 'D60', name: 'Shashtyamsa', description: 'Nghiệp quả (Quá khứ/Tương lai)', divisions: 60, method: 'calculation_formula' }
};

// Sign indices (0-11): Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces
const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// Modality groups (0-indexed)
const MOVABLE_SIGNS = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn
const FIXED_SIGNS = [1, 4, 7, 10]; // Taurus, Leo, Scorpio, Aquarius
const DUAL_SIGNS = [2, 5, 8, 11]; // Gemini, Virgo, Sagittarius, Pisces

// Element groups (0-indexed)
const FIRE_SIGNS = [0, 4, 8]; // Aries, Leo, Sagittarius
const EARTH_SIGNS = [1, 5, 9]; // Taurus, Virgo, Capricorn
const AIR_SIGNS = [2, 6, 10]; // Gemini, Libra, Aquarius
const WATER_SIGNS = [3, 7, 11]; // Cancer, Scorpio, Pisces

/**
 * Check if a sign is odd (1-indexed) or even
 */
function isOddSign(signIndex: number): boolean {
  // Signs are 0-indexed, so we add 1 to check odd/even
  return (signIndex + 1) % 2 === 1;
}

/**
 * Get modality of a sign
 */
function getModality(signIndex: number): 'movable' | 'fixed' | 'dual' {
  if (MOVABLE_SIGNS.includes(signIndex)) return 'movable';
  if (FIXED_SIGNS.includes(signIndex)) return 'fixed';
  return 'dual';
}

/**
 * Get element of a sign
 */
function getElement(signIndex: number): 'fire' | 'earth' | 'air' | 'water' {
  if (FIRE_SIGNS.includes(signIndex)) return 'fire';
  if (EARTH_SIGNS.includes(signIndex)) return 'earth';
  if (AIR_SIGNS.includes(signIndex)) return 'air';
  return 'water';
}

/**
 * Calculate divisional chart from base chart data using Parashara system
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
    const divisionalPosition = calculateDivisionalPosition(planet.longitude, config);
    
    return {
      ...planet,
      longitude: divisionalPosition.longitude,
      sign: divisionalPosition.sign,
      house: 0 // Will be recalculated based on ascendant
    };
  });

  // Calculate divisional ascendant
  const divisionalAscendant = calculateDivisionalPosition(baseChartData.ascendant, config);
  
  // Recalculate house positions based on divisional ascendant
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
    ascendantNakshatra: baseChartData.ascendantNakshatra,
    planets: planetsWithHouses,
    houses: housesWithPlanetIds
  };
}

/**
 * Calculate divisional position from longitude using Parashara methods
 */
function calculateDivisionalPosition(longitude: number, config: DivisionalChartConfig): { longitude: number; sign: number } {
  // Normalize longitude to 0-360
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  
  // Get original sign (0-11)
  const originalSign = Math.floor(normalizedLongitude / 30);
  
  // Get position within the sign (0-30 degrees)
  const positionInSign = normalizedLongitude % 30;
  
  let newSign: number;
  let newPositionInSign: number;
  
  switch (config.method) {
    case 'simple':
      // D1: Keep original
      newSign = originalSign;
      newPositionInSign = positionInSign;
      break;
      
    case 'odd_even_fixed':
      // D2: Hora
      newSign = calculateHora(originalSign, positionInSign);
      newPositionInSign = positionInSign * 2; // Scale up
      break;
      
    case 'trine_jump':
      // D3: Drekkana
      newSign = calculateDrekkana(originalSign, positionInSign);
      newPositionInSign = (positionInSign % 10) * 3; // Scale up
      break;
      
    case 'cycle_start_current':
      // D4, D12
      newSign = calculateCycleStartCurrent(originalSign, positionInSign, config.divisions);
      newPositionInSign = (positionInSign % (30 / config.divisions)) * config.divisions;
      break;
      
    case 'odd_even_start':
      // D7, D10
      newSign = calculateOddEvenStart(originalSign, positionInSign, config.divisions, config.type);
      newPositionInSign = (positionInSign % (30 / config.divisions)) * config.divisions;
      break;
      
    case 'modality_based':
      // D9: Navamsa
      newSign = calculateNavamsa(originalSign, positionInSign);
      newPositionInSign = (positionInSign % (30 / 9)) * 9;
      break;
      
    case 'modality_based_fixed_start':
      // D16, D20, D45
      newSign = calculateModalityBasedFixedStart(originalSign, positionInSign, config.divisions, config.type);
      newPositionInSign = (positionInSign % (30 / config.divisions)) * config.divisions;
      break;
      
    case 'odd_even_fixed_start':
      // D24, D40
      newSign = calculateOddEvenFixedStart(originalSign, positionInSign, config.divisions, config.type);
      newPositionInSign = (positionInSign % (30 / config.divisions)) * config.divisions;
      break;
      
    case 'element_based_fixed_start':
      // D27: Bhamsa
      newSign = calculateBhamsa(originalSign, positionInSign);
      newPositionInSign = (positionInSign % (30 / 27)) * 27;
      break;
      
    case 'custom_degrees_mapping':
      // D30: Trimsamsa
      newSign = calculateTrimsamsa(originalSign, positionInSign);
      newPositionInSign = positionInSign; // Keep original degree
      break;
      
    case 'calculation_formula':
      // D60: Shashtyamsa
      newSign = calculateShashtyamsa(originalSign, positionInSign);
      newPositionInSign = (positionInSign % (30 / 60)) * 60;
      break;
      
    default:
      // Fallback to simple calculation
      const divisionSize = 30 / config.divisions;
      const divisionIndex = Math.floor(positionInSign / divisionSize);
      newSign = (originalSign * config.divisions + divisionIndex) % 12;
      newPositionInSign = (positionInSign % divisionSize) * config.divisions;
  }
  
  // Normalize new position
  if (newPositionInSign >= 30) {
    newSign = (newSign + 1) % 12;
    newPositionInSign = newPositionInSign % 30;
  }
  
  const newLongitude = newSign * 30 + newPositionInSign;
  
  return {
    longitude: newLongitude,
    sign: newSign
  };
}

/**
 * D2: Hora - Odd signs: 0-15° = Leo (4), 15-30° = Cancer (3)
 * Even signs: 0-15° = Cancer (3), 15-30° = Leo (4)
 * Note: Signs are 0-indexed, so Leo = 4, Cancer = 3
 */
function calculateHora(originalSign: number, positionInSign: number): number {
  const isOdd = isOddSign(originalSign);
  const isFirstHalf = positionInSign < 15;
  
  if (isOdd) {
    // Odd signs: 0-15° = Leo (4), 15-30° = Cancer (3)
    return isFirstHalf ? 4 : 3;
  } else {
    // Even signs: 0-15° = Cancer (3), 15-30° = Leo (4)
    return isFirstHalf ? 3 : 4;
  }
}

/**
 * D3: Drekkana - Part 1: current sign, Part 2: 5th from current, Part 3: 9th from current
 */
function calculateDrekkana(originalSign: number, positionInSign: number): number {
  const part = Math.floor(positionInSign / 10);
  
  if (part === 0) {
    return originalSign; // Part 1: current sign
  } else if (part === 1) {
    return (originalSign + 4) % 12; // Part 2: 5th from current (offset 4)
  } else {
    return (originalSign + 8) % 12; // Part 3: 9th from current (offset 8)
  }
}

/**
 * D4, D12: Cycle starting from current sign
 * D4: Parts go to signs 1, 4, 7, 10 from current (offsets 0, 3, 6, 9)
 * D12: Each part goes to next sign sequentially (offset = part index)
 */
function calculateCycleStartCurrent(originalSign: number, positionInSign: number, divisions: number): number {
  const divisionSize = 30 / divisions;
  const partIndex = Math.floor(positionInSign / divisionSize);
  
  if (divisions === 4) {
    // D4: sequence [0, 3, 6, 9] = [1st, 4th, 7th, 10th from current]
    // This means: part 0 -> current sign, part 1 -> 4th from current, etc.
    const offsets = [0, 3, 6, 9];
    return (originalSign + offsets[partIndex]) % 12;
  } else {
    // D12: Each part goes to next sign sequentially
    return (originalSign + partIndex) % 12;
  }
}

/**
 * D7, D10: Odd signs start from current, Even signs start from different position
 * D7: Even signs start from opposite (7th)
 * D10: Even signs start from 9th from current
 */
function calculateOddEvenStart(originalSign: number, positionInSign: number, divisions: number, chartType: DivisionalChartType): number {
  const divisionSize = 30 / divisions;
  const partIndex = Math.floor(positionInSign / divisionSize);
  const isOdd = isOddSign(originalSign);

  if (isOdd) {
    // Start from current sign
    return (originalSign + partIndex) % 12;
  } else {
    // Even signs
    if (chartType === 'D7') {
      // SỬA: Start from opposite sign (7th) = current + 6
      return (originalSign + 6 + partIndex) % 12; 
    } else {
      // D10: SỬA: Start from 9th = current + 8
      return (originalSign + 8 + partIndex) % 12;
    }
  }
}

/**
 * FIXED: Subtract 1 from the offset because counting includes the starting sign
 * Fixed signs start from 9th (offset +8)
 * Dual signs start from 5th (offset +4)
 */
function calculateNavamsa(originalSign: number, positionInSign: number): number {
  const divisionSize = 30 / 9;
  const partIndex = Math.floor(positionInSign / divisionSize);
  const modality = getModality(originalSign);
  
  let startOffset = 0;
  if (modality === 'fixed') {
    startOffset = 8; // SỬA: 9th from current = current + 8
  } else if (modality === 'dual') {
    startOffset = 4; // SỬA: 5th from current = current + 4
  }
  // movable: startOffset = 0 (current sign)
  
  return (originalSign + startOffset + partIndex) % 12;
}

/**
 * D16, D20, D45: Modality based with fixed start signs
 * The part index determines which sign in the sequence we use
 */
function calculateModalityBasedFixedStart(originalSign: number, positionInSign: number, divisions: number, chartType: DivisionalChartType): number {
  const divisionSize = 30 / divisions;
  const partIndex = Math.floor(positionInSign / divisionSize);
  const modality = getModality(originalSign);
  
  let startSignId: number;
  
  if (chartType === 'D16' || chartType === 'D45') {
    // D16, D45: Movable from Aries (1), Fixed from Leo (5), Dual from Sagittarius (9)
    startSignId = modality === 'movable' ? 1 : modality === 'fixed' ? 5 : 9;
  } else {
    // D20: Movable from Aries (1), Fixed from Sagittarius (9), Dual from Leo (5)
    startSignId = modality === 'movable' ? 1 : modality === 'fixed' ? 9 : 5;
  }
  
  // Convert to 0-indexed (sign IDs in config are 1-indexed)
  const startSign = startSignId - 1;
  
  // The part index tells us which sign in the sequence (starting from startSign)
  // For example, if startSign = 0 (Aries) and partIndex = 5, we go 5 signs from Aries
  return (startSign + partIndex) % 12;
}

/**
 * D24, D40: Odd/Even with fixed start signs
 * D24: Odd from Leo (5), Even from Cancer (4)
 * D40: Odd from Aries (1), Even from Libra (7)
 */
function calculateOddEvenFixedStart(originalSign: number, positionInSign: number, divisions: number, chartType: DivisionalChartType): number {
  const divisionSize = 30 / divisions;
  const partIndex = Math.floor(positionInSign / divisionSize);
  const isOdd = isOddSign(originalSign);
  
  let startSignId: number;
  if (chartType === 'D24') {
    startSignId = isOdd ? 5 : 4; // Leo : Cancer
  } else {
    // D40
    startSignId = isOdd ? 1 : 7; // Aries : Libra
  }
  
  const startSign = startSignId - 1; // Convert to 0-indexed
  return (startSign + partIndex) % 12;
}

/**
 * D27: Bhamsa - Element based with fixed start signs
 * Fire from Aries (1), Earth from Cancer (4), Air from Libra (7), Water from Capricorn (10)
 */
function calculateBhamsa(originalSign: number, positionInSign: number): number {
  const divisionSize = 30 / 27;
  const partIndex = Math.floor(positionInSign / divisionSize);
  const element = getElement(originalSign);
  
  const startSignIds: Record<string, number> = {
    fire: 1,    // Aries
    earth: 4,  // Cancer
    air: 7,     // Libra
    water: 10   // Capricorn
  };
  
  const startSign = startSignIds[element] - 1; // Convert to 0-indexed
  return (startSign + partIndex) % 12;
}

/**
 * D30: Trimsamsa - Custom degree mapping based on rulers (unequal divisions)
 * Cung Lẻ: 0°-5° (Hỏa/Aries), 5°-10° (Thổ/Aquarius), 10°-18° (Mộc/Sagittarius), 
 *          18°-25° (Thủy/Gemini), 25°-30° (Kim/Libra)
 * Cung Chẵn: 0°-5° (Kim/Taurus), 5°-12° (Thủy/Virgo), 12°-20° (Mộc/Pisces),
 *            20°-25° (Thổ/Capricorn), 25°-30° (Hỏa/Scorpio)
 */
function calculateTrimsamsa(originalSign: number, positionInSign: number): number {
  const isOdd = isOddSign(originalSign);
  
  if (isOdd) {
    // Odd signs: 0°-5° (Hỏa), 5°-10° (Thổ), 10°-18° (Mộc), 18°-25° (Thủy), 25°-30° (Kim)
    if (positionInSign <= 5) return 0;      // Aries (Mars/Hỏa)
    if (positionInSign <= 10) return 10;    // Aquarius (Saturn/Thổ)
    if (positionInSign <= 18) return 8;     // Sagittarius (Jupiter/Mộc)
    if (positionInSign <= 25) return 2;     // Gemini (Mercury/Thủy)
    return 6;                                 // Libra (Venus/Kim)
  } else {
    // Even signs: 0°-5° (Kim), 5°-12° (Thủy), 12°-20° (Mộc), 20°-25° (Thổ), 25°-30° (Hỏa)
    if (positionInSign <= 5) return 1;       // Taurus (Venus/Kim)
    if (positionInSign <= 12) return 5;     // Virgo (Mercury/Thủy)
    if (positionInSign <= 20) return 11;    // Pisces (Jupiter/Mộc)
    if (positionInSign <= 25) return 9;     // Capricorn (Saturn/Thổ)
    return 7;                                 // Scorpio (Mars/Hỏa)
  }
}

/**
 * D60: Shashtyamsa - Count sequentially from current sign
 * Each 0.5 degree (30 minutes) corresponds to the next sign in sequence
 * Starting from the current sign itself
 */
function calculateShashtyamsa(originalSign: number, positionInSign: number): number {
  // Each division is 0.5 degrees (30 minutes)
  // Count sequentially from current sign
  const divisionSize = 30 / 60; // 0.5 degrees
  const partIndex = Math.floor(positionInSign / divisionSize);
  
  // Count sequentially from current sign
  return (originalSign + partIndex) % 12;
}

/**
 * Recalculate house positions based on new ascendant
 */
function recalculateHouses(
  baseHouses: House[],
  planets: Planet[],
  newAscendant: number
): House[] {
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
  const normalizedPlanet = ((planetLongitude % 360) + 360) % 360;
  const normalizedAsc = ((ascendant % 360) + 360) % 360;
  
  let difference = normalizedPlanet - normalizedAsc;
  if (difference < 0) {
    difference += 360;
  }
  
  const houseNumber = Math.floor(difference / 30) + 1;
  return houseNumber > 12 ? houseNumber - 12 : houseNumber;
}

/**
 * Get all available divisional chart types (excluding D1)
 */
export function getAvailableDivisionalCharts(): DivisionalChartConfig[] {
  return Object.values(DIVISIONAL_CHART_CONFIGS).filter(config => config.type !== 'D1');
}
