
/**
 * Swiss Ephemeris WebAssembly Service
 * This service manages loading and using the Swiss Ephemeris WebAssembly module
 */

// Import the pre-compiled SwissEph WebAssembly module
// Note: We're using the NPM package that provides WebAssembly bindings
import * as swisseph from 'swisseph';

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
  house: number; // Changed from optional to required to match VedicChartData
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
  { id: "su", name: "Sun", planet: swisseph.SE_SUN, symbol: "☉", color: "#FFA500" },
  { id: "mo", name: "Moon", planet: swisseph.SE_MOON, symbol: "☽", color: "#SILVER" },
  { id: "me", name: "Mercury", planet: swisseph.SE_MERCURY, symbol: "☿", color: "#00FF00" },
  { id: "ve", name: "Venus", planet: swisseph.SE_VENUS, symbol: "♀", color: "#FFFFFF" },
  { id: "ma", name: "Mars", planet: swisseph.SE_MARS, symbol: "♂", color: "#FF0000" },
  { id: "ju", name: "Jupiter", planet: swisseph.SE_JUPITER, symbol: "♃", color: "#FFFF00" },
  { id: "sa", name: "Saturn", planet: swisseph.SE_SATURN, symbol: "♄", color: "#000080" },
  { id: "ra", name: "Rahu", planet: swisseph.SE_MEAN_NODE, symbol: "☊", color: "#4B0082" },
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

// Module initialization status
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the Swiss Ephemeris WebAssembly module
 * This must be called before any calculations are done
 */
export async function initializeSwissEph(): Promise<void> {
  if (isInitialized) {
    return Promise.resolve();
  }
  
  if (initializationPromise) {
    return initializationPromise;
  }
  
  console.log("Initializing Swiss Ephemeris WebAssembly module...");
  
  initializationPromise = new Promise<void>((resolve, reject) => {
    try {
      // Set the path to ephemeris data - Fixed function name
      // In a production environment, you'd host these files on your server or CDN
      swisseph.swe_set_ephe_path('/ephe');
      
      // Set Lahiri Ayanamsa (most commonly used in Vedic astrology) - Fixed function name and constant
      swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
      
      console.log("Swiss Ephemeris initialized successfully");
      isInitialized = true;
      resolve();
    } catch (error) {
      console.error("Failed to initialize Swiss Ephemeris:", error);
      reject(error);
    }
  });
  
  return initializationPromise;
}

/**
 * Calculate Julian Day from date and time components
 */
function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  // Fixed function name and constant
  return swisseph.swe_julday(year, month, day, hour + minute / 60, swisseph.SE_GREG_CAL);
}

/**
 * Calculate Vedic chart using the Swiss Ephemeris WebAssembly module
 */
export async function calculateVedicChartWasm(params: SwissEphParams): Promise<VedicChartResult> {
  try {
    // Ensure the module is initialized
    await initializeSwissEph();
    
    // Parse date and time
    const { year, month, day, hour, minute, latitude, longitude } = params;
    
    // Calculate Julian day
    const julianDay = calculateJulianDay(year, month, day, hour, minute);
    console.log("Julian day:", julianDay);
    
    // Calculate flag for sidereal positions
    const flag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SIDEREAL;
    
    // Calculate planet positions
    const planetResults: PlanetPosition[] = [];
    
    for (const planet of PLANETS) {
      if (planet.id === "ke") continue; // Ketu is calculated separately from Rahu
      
      try {
        // Fixed function name
        const result = swisseph.swe_calc_ut(julianDay, planet.planet, flag);
        
        const longitude = result.longitude;
        const sign = Math.floor(longitude / 30);
        
        planetResults.push({
          id: planet.id,
          name: planet.name,
          symbol: planet.symbol,
          longitude: longitude,
          retrograde: result.retrograde || (result.speed && result.speed < 0),
          sign: sign,
          house: 1, // Default house, will be assigned properly later
          color: planet.color
        });
      } catch (err) {
        console.error(`Error calculating ${planet.id}:`, err);
      }
    }
    
    // Add Ketu (South Node) - 180 degrees from Rahu
    const rahu = planetResults.find(p => p.id === "ra");
    if (rahu) {
      const ketuLongitude = (rahu.longitude + 180) % 360;
      const ketuSign = Math.floor(ketuLongitude / 30);
      
      planetResults.push({
        id: "ke",
        name: "Ketu",
        symbol: "☋",
        longitude: ketuLongitude,
        retrograde: false,
        sign: ketuSign,
        house: 1, // Default house, will be assigned properly later
        color: "#800000"
      });
    }
    
    // Calculate ascendant and houses - Fixed function name
    const houses = swisseph.swe_houses(julianDay, latitude, longitude, 'P'); // Placidus house system
    console.log("Houses calculation:", houses);
    
    // The ascendant is already sidereal since we set the sidereal mode earlier
    const ascendant = houses.ascendant;
    
    // Format houses data
    const houseCusps: HouseCusp[] = Array.from({ length: 12 }, (_, i) => {
      const houseLongitude = houses.cusps[i + 1];
      return {
        number: i + 1,
        longitude: houseLongitude,
        sign: Math.floor(houseLongitude / 30)
      };
    });
    
    // Assign houses to planets
    for (const planet of planetResults) {
      // Find house for each planet based on its position relative to the ascendant
      let houseIndex = 0;
      for (let i = 0; i < houseCusps.length; i++) {
        const nextHouseIndex = (i + 1) % 12;
        const currentHouseLongitude = houseCusps[i].longitude;
        const nextHouseLongitude = houseCusps[nextHouseIndex].longitude;
        
        // Check if the planet is in this house
        if (nextHouseLongitude < currentHouseLongitude) {
          // House spans 0° Aries
          if ((planet.longitude >= currentHouseLongitude) || 
              (planet.longitude < nextHouseLongitude)) {
            houseIndex = i;
            break;
          }
        } else {
          // Regular case
          if ((planet.longitude >= currentHouseLongitude) && 
              (planet.longitude < nextHouseLongitude)) {
            houseIndex = i;
            break;
          }
        }
      }
      
      planet.house = houseCusps[houseIndex].number;
    }
    
    // Calculate Moon Nakshatra
    const moon = planetResults.find(p => p.id === "mo");
    let moonNakshatra = "Unknown";
    if (moon) {
      const moonLongitude = moon.longitude;
      // 27 nakshatras in 360 degrees
      const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
      moonNakshatra = NAKSHATRAS[nakshatraIndex];
    }
    
    // Calculate Lunar Day (Tithi)
    const sun = planetResults.find(p => p.id === "su");
    let lunarDay = 1;
    if (moon && sun) {
      const sunLongitude = sun.longitude;
      const moonLongitude = moon.longitude;
      lunarDay = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
    }
    
    return {
      ascendant,
      planets: planetResults,
      houses: houseCusps,
      moonNakshatra,
      lunarDay
    };
  } catch (error) {
    console.error("Error calculating Vedic chart:", error);
    throw error;
  }
}

/**
 * Generate fallback chart data when WebAssembly is not available
 */
export function generateFallbackChart(params: SwissEphParams): VedicChartResult {
  const { year, month, day, hour, minute, latitude, longitude } = params;
  const timestamp = new Date(year, month - 1, day, hour, minute).getTime();
  const seed = timestamp + latitude + longitude;
  
  // Calculate a deterministic but fake ascendant
  const ascendant = (seed % 360);
  
  // Generate planet positions
  const planets = PLANETS.map(planet => {
    const randomOffset = (parseInt(planet.id, 36) * 31) % 360;
    const longitude = (seed + randomOffset) % 360;
    const sign = Math.floor(longitude / 30);
    
    // Calculate house based on planet position relative to ascendant
    let houseNumber = Math.floor((longitude - ascendant) / 30);
    if (houseNumber < 0) houseNumber += 12;
    houseNumber = (houseNumber + 1) % 12 || 12; // Houses are 1-12, not 0-11
    
    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      longitude: longitude,
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
  
  // Calculate Moon Nakshatra
  const moonLongitude = planets.find(p => p.id === "mo")?.longitude || 0;
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360) % 27;
  const moonNakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Calculate Lunar Day (Tithi)
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
