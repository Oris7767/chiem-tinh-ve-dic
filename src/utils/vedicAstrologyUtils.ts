
import { DateTime } from 'luxon';
import { PLANETS, NAKSHATRAS, PLANET_COLORS } from './constants';

// Input parameters for chart calculation
interface ChartParams {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Types from VedicChart.tsx
interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  sign: number;
  house: number;
  retrograde: boolean;
  color: string;
}

interface House {
  number: number;
  longitude: number;
  sign: number;
}

interface VedicChartData {
  ascendant: number;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

// Mock implementation for calculating planet positions
// In a real implementation, this would use the Swiss Ephemeris or similar library
export const calculatePlanetPositions = (
  dateTime: DateTime,
  latitude: number,
  longitude: number
): Planet[] => {
  // We're using a deterministic seed based on the input parameters
  // to generate consistent "random" positions for demo purposes
  const timeValue = dateTime.toMillis();
  const seed = timeValue + latitude * 100 + longitude * 100;
  
  return PLANETS.map(planet => {
    // Generate a pseudo-random longitude based on the planet and seed
    // This ensures consistent results for the same input
    const hash = ((seed % 10000) + planet.id.charCodeAt(0) * 100 + planet.id.charCodeAt(1) * 10) % 1000;
    const planetLongitude = (hash / 1000) * 360; // 0-360 degrees
    
    // Determine the sign (0-11)
    const sign = Math.floor(planetLongitude / 30);
    
    // Generate retrograde status 
    // Some planets are more likely to be retrograde than others
    let retrograde = false;
    if (['me', 'ma', 've', 'ju', 'sa'].includes(planet.id)) {
      retrograde = (hash % 10) < 2; // 20% chance
    }
    
    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      longitude: planetLongitude,
      sign: sign,
      house: 0, // Will be calculated after we determine the ascendant
      retrograde: retrograde,
      color: PLANET_COLORS[planet.id as keyof typeof PLANET_COLORS] || '#000000'
    };
  });
};

// Calculate houses starting from the ascendant
export const calculateHouses = (
  dateTime: DateTime,
  latitude: number,
  longitude: number
): { houses: House[], ascendant: number } => {
  // In a real implementation, this would use proper astronomical calculations
  // Here we're using a simplified approach for demo purposes
  
  // Calculate a deterministic ascendant based on the inputs
  const timeValue = dateTime.toMillis();
  const dayOfYear = dateTime.toObject().ordinal || 1;
  const hourOfDay = dateTime.hour;
  
  // The ascendant makes a full rotation every day, so it's heavily influenced by the time
  const baseAscendant = (hourOfDay * 15) % 360; // 15 degrees per hour
  
  // Add some variation based on the date and location
  const ascendant = (baseAscendant + dayOfYear + latitude / 10 + longitude / 15) % 360;
  
  // Create 12 houses, each 30 degrees apart, starting from the ascendant
  const houses: House[] = [];
  for (let i = 1; i <= 12; i++) {
    const houseLongitude = (ascendant + (i - 1) * 30) % 360;
    houses.push({
      number: i,
      longitude: houseLongitude,
      sign: Math.floor(houseLongitude / 30)
    });
  }
  
  return { houses, ascendant };
};

// Calculate the Vedic chart
export const calculateVedicChart = async (params: ChartParams): Promise<VedicChartData> => {
  try {
    console.log("Calculating Vedic chart with parameters:", params);
    
    // Parse the input date and time
    const dateTime = DateTime.fromFormat(
      `${params.date} ${params.time}`, 
      'yyyy-MM-dd HH:mm',
      { zone: params.timezone }
    );
    
    if (!dateTime.isValid) {
      throw new Error(`Invalid date or time: ${dateTime.invalidExplanation}`);
    }
    
    // Calculate houses and ascendant
    const { houses, ascendant } = calculateHouses(dateTime, params.latitude, params.longitude);
    
    // Calculate planet positions
    let planets = calculatePlanetPositions(dateTime, params.latitude, params.longitude);
    
    // Assign houses to planets based on their position relative to the ascendant
    planets = planets.map(planet => {
      // Calculate the house number (1-12) based on the planet's position relative to the ascendant
      let house = Math.floor(((planet.longitude - ascendant + 360) % 360) / 30) + 1;
      return { ...planet, house };
    });
    
    // Calculate Moon Nakshatra (27 nakshatras in 360 degrees)
    const moonPlanet = planets.find(p => p.id === "mo");
    let moonNakshatra = "Unknown";
    if (moonPlanet) {
      const nakshatraIndex = Math.floor((moonPlanet.longitude * 27) / 360) % 27;
      moonNakshatra = NAKSHATRAS[nakshatraIndex];
    }
    
    // Calculate Lunar Day (Tithi) - simplified
    const sunPlanet = planets.find(p => p.id === "su");
    let lunarDay = 1;
    if (moonPlanet && sunPlanet) {
      // Tithi is based on the longitudinal distance between the Moon and the Sun
      // divided into 30 portions of 12 degrees each
      const moonSunAngle = (moonPlanet.longitude - sunPlanet.longitude + 360) % 360;
      lunarDay = Math.floor(moonSunAngle / 12) + 1;
    }
    
    const result: VedicChartData = {
      ascendant,
      planets,
      houses,
      moonNakshatra,
      lunarDay
    };
    
    console.log("Calculated chart:", result);
    return result;
    
  } catch (error) {
    console.error("Error in calculateVedicChart:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error calculating chart");
  }
};
