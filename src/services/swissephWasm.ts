
/**
 * Swiss Ephemeris WebAssembly Service
 * This service provides mock Vedic chart calculations since we can't use the SwissEph node module in the browser
 */

// Interface for Swiss Ephemeris calculation parameters
export interface SwissEphParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Interface for a planet position result
export interface PlanetPosition {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  latitude?: number;
  distance?: number;
  speed?: number;
  retrograde: boolean;
  sign: number;
  house: number; // Required to match VedicChartData
  color: string;
}

// Interface for a house cusp
export interface HouseCusp {
  number: number;
  longitude: number;
  sign: number;
}

// Interface for chart calculation result
export interface VedicChartResult {
  ascendant: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  moonNakshatra: string;
  lunarDay: number;
}

// Planet data for reference
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFA500" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#SILVER" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#00FF00" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FFFFFF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF0000" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFFF00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#000080" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#4B0082" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#800000" } // South Node, calculated from Rahu
];

// List of 27 Nakshatras
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

/**
 * Generate consistent chart data for demonstration purposes
 * This replaces the actual SwissEph calculations since we can't use the Node module in browser
 */
export function generateVedicChart(params: SwissEphParams): VedicChartResult {
  const { year, month, day, hour, minute, latitude, longitude } = params;
  
  // Create a consistent seed value based on the input parameters
  const date = new Date(year, month - 1, day, hour, minute);
  const timestamp = date.getTime();
  const seed = timestamp + latitude + longitude;
  
  // Calculate a deterministic but demo ascendant
  const ascendant = (seed % 360);
  
  // Generate planet positions
  const planets = PLANETS.map(planet => {
    // Create a unique offset for each planet that's still deterministic
    const randomOffset = (parseInt(planet.id, 36) * 31) % 360;
    const planetLongitude = (seed + randomOffset) % 360;
    const sign = Math.floor(planetLongitude / 30);
    
    // Calculate house based on planet position relative to ascendant
    let houseNumber = Math.floor((planetLongitude - ascendant + 360) / 30);
    if (houseNumber < 0) houseNumber += 12;
    houseNumber = (houseNumber % 12) + 1; // Houses are 1-12, not 0-11
    
    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      longitude: planetLongitude,
      sign: sign,
      house: houseNumber,
      retrograde: ((seed + parseInt(planet.id, 36)) % 5) === 0, // ~20% chance of retrograde
      color: planet.color
    };
  });
  
  // Calculate houses
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseLongitude = (ascendant + i * 30) % 360;
    return {
      number: i + 1,
      longitude: houseLongitude,
      sign: Math.floor(houseLongitude / 30)
    };
  });
  
  // Calculate Moon Nakshatra (27 nakshatras in 360 degrees)
  const moonLongitude = planets.find(p => p.id === "mo")?.longitude || 0;
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360) % 27;
  const moonNakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Calculate Lunar Day (Tithi) - simplified calculation
  const sunLongitude = planets.find(p => p.id === "su")?.longitude || 0;
  const lunarDay = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
  
  return {
    ascendant,
    planets,
    houses,
    moonNakshatra,
    lunarDay
  };
}

/**
 * This is the main entry point for chart calculations
 * Since we can't use SwissEph WebAssembly in the browser environment,
 * we're using the fallback implementation only
 */
export async function calculateVedicChartWasm(params: SwissEphParams): Promise<VedicChartResult> {
  console.log("Using demo chart generator instead of SwissEph WebAssembly");
  return generateVedicChart(params);
}
