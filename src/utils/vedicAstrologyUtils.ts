import { DateTime } from 'luxon';
import { PLANETS, NAKSHATRAS, PLANET_COLORS } from './constants';

// Constants for astronomical calculations
const AYANAMSA_OFFSET = 24.0; // Ayanamsa offset in degrees (approximate for current time)
const EARTH_ROTATION_RATE = 360.0 / 24.0; // Earth rotates 360 degrees in 24 hours

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

// Convert date to Julian Day
const toJulianDay = (dateTime: DateTime): number => {
  // Julian date calculation - this is a simplified version
  // For accurate calculations, we'd use the proper astronomical formulas
  const year = dateTime.year;
  const month = dateTime.month;
  const day = dateTime.day + 
    (dateTime.hour + dateTime.minute / 60.0 + dateTime.second / 3600.0) / 24.0;
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  return jd;
}

// Convert tropical coordinates to sidereal using Ayanamsa
const tropicalToSidereal = (longitude: number): number => {
  return (longitude - AYANAMSA_OFFSET + 360) % 360;
}

// Calculate Local Sidereal Time
const calculateLST = (julianDay: number, longitude: number): number => {
  // Calculate Greenwich Sidereal Time (GST)
  const T = (julianDay - 2451545.0) / 36525.0; // Julian centuries since J2000.0
  let theta = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
    0.000387933 * T * T - T * T * T / 38710000.0;
  
  // Normalize to 0-360
  theta = theta % 360;
  if (theta < 0) theta += 360;
  
  // Convert GST to Local Sidereal Time
  let lst = theta + longitude;
  lst = lst % 360;
  if (lst < 0) lst += 360;
  
  return lst;
}

// Calculate the ascendant (Lagna)
const calculateAscendant = (julianDay: number, latitude: number, longitude: number): number => {
  // Local Sidereal Time in degrees
  const lst = calculateLST(julianDay, longitude);
  
  // Convert LST to radians
  const lstRad = lst * Math.PI / 180.0;
  
  // Obliquity of the ecliptic (approximate)
  const obliquity = 23.439281 * Math.PI / 180.0;
  
  // Convert latitude to radians
  const latRad = latitude * Math.PI / 180.0;
  
  // Calculate the ascendant
  const ascRad = Math.atan2(
    Math.cos(lstRad), 
    Math.sin(lstRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity)
  );
  
  // Convert to degrees
  let ascendant = ascRad * 180.0 / Math.PI;
  
  // Normalize to 0-360
  ascendant = (ascendant + 360) % 360;
  
  // Convert to sidereal
  return tropicalToSidereal(ascendant);
}

// Mock implementation for calculating planet positions
// In a real implementation, this would use the Swiss Ephemeris or similar library from VedAstro
export const calculatePlanetPositions = (
  dateTime: DateTime,
  latitude: number,
  longitude: number,
  julianDay: number
): Planet[] => {
  // In a real implementation, we'd use proper ephemeris calculations
  // For now, we'll use a more realistic approach based on rough orbital periods
  
  // Define orbital periods in days
  const orbitalPeriods = {
    su: 365.25,     // Sun (Earth's orbit)
    mo: 27.32,      // Moon
    me: 87.97,      // Mercury
    ve: 224.7,      // Venus
    ma: 687.0,      // Mars
    ju: 4332.59,    // Jupiter
    sa: 10759.22,   // Saturn
    ra: 6793.39,    // Rahu (Node) - approximation
    ke: 6793.39     // Ketu (opposite to Rahu)
  };
  
  // Base epoch for calculation (J2000.0)
  const baseJulianDay = 2451545.0;
  
  // Days since the epoch
  const daysSinceEpoch = julianDay - baseJulianDay;
  
  // Initial positions at the epoch (approximately)
  const initialPositions = {
    su: 280.46,     // Sun
    mo: 318.15,     // Moon
    me: 174.79,     // Mercury
    ve: 50.40,      // Venus
    ma: 19.39,      // Mars
    ju: 317.02,     // Jupiter
    sa: 173.99,     // Saturn
    ra: 125.04,     // Rahu (North Node)
    ke: 305.04      // Ketu (South Node)
  };
  
  // Calculate positions
  return PLANETS.map(planet => {
    // Calculate tropical longitude
    const period = orbitalPeriods[planet.id as keyof typeof orbitalPeriods] || 365.25;
    const initialPos = initialPositions[planet.id as keyof typeof initialPositions] || 0;
    
    // Mean longitude calculation
    const meanMotion = 360.0 / period; // Degrees per day
    let longitude = initialPos + meanMotion * daysSinceEpoch;
    
    // Add some perturbations for more realistic positions
    longitude += 5 * Math.sin((daysSinceEpoch % 365.25) * 2 * Math.PI / 365.25);
    
    // Normalize to 0-360
    longitude = longitude % 360;
    if (longitude < 0) longitude += 360;
    
    // Convert to sidereal coordinates
    const siderealLongitude = tropicalToSidereal(longitude);
    
    // Determine the sign (0-11)
    const sign = Math.floor(siderealLongitude / 30);
    
    // Generate retrograde status 
    // Realistic retrograde frequencies for planets
    let retrograde = false;
    if (planet.id === 'me' || planet.id === 've' || planet.id === 'ma' || 
        planet.id === 'ju' || planet.id === 'sa') {
      // Mercury retrogrades most frequently
      if (planet.id === 'me') {
        const mercuryRetrogradePeriod = 116; // days
        retrograde = Math.sin((daysSinceEpoch % mercuryRetrogradePeriod) * 2 * Math.PI / mercuryRetrogradePeriod) > 0.8;
      } 
      // Other planets retrograde less frequently
      else {
        const retrogradeSeed = (daysSinceEpoch % period) / period;
        retrograde = retrogradeSeed > 0.9 && retrogradeSeed < 0.98;
      }
    }
    
    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      longitude: siderealLongitude,
      sign: sign,
      house: 0, // Will be calculated after we determine the ascendant
      retrograde: retrograde,
      color: PLANET_COLORS[planet.id as keyof typeof PLANET_COLORS] || '#000000'
    };
  });
};

// Calculate houses starting from the ascendant
export const calculateHouses = (
  ascendant: number
): House[] => {
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
  
  return houses;
};

// Calculate lunar day (Tithi)
const calculateLunarDay = (moonLongitude: number, sunLongitude: number): number => {
  // Tithi is based on the longitudinal distance between the Moon and the Sun
  // divided into 30 portions of 12 degrees each
  const moonSunAngle = (moonLongitude - sunLongitude + 360) % 360;
  return Math.floor(moonSunAngle / 12) + 1;
};

// Calculate Moon's Nakshatra
const calculateMoonNakshatra = (moonLongitude: number): string => {
  // 27 nakshatras in 360 degrees
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360) % 27;
  return NAKSHATRAS[nakshatraIndex];
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
    
    // Calculate Julian Day
    const julianDay = toJulianDay(dateTime);
    console.log("Julian Day:", julianDay);
    
    // Calculate the ascendant
    const ascendant = calculateAscendant(julianDay, params.latitude, params.longitude);
    console.log("Ascendant:", ascendant);
    
    // Calculate houses
    const houses = calculateHouses(ascendant);
    
    // Calculate planet positions
    let planets = calculatePlanetPositions(dateTime, params.latitude, params.longitude, julianDay);
    
    // Assign houses to planets based on their position relative to the ascendant
    planets = planets.map(planet => {
      // Calculate the house number (1-12) based on the planet's position relative to the ascendant
      let house = Math.floor(((planet.longitude - ascendant + 360) % 360) / 30) + 1;
      return { ...planet, house };
    });
    
    // Find Moon and Sun positions
    const moonPlanet = planets.find(p => p.id === "mo");
    const sunPlanet = planets.find(p => p.id === "su");
    
    // Calculate Moon Nakshatra
    let moonNakshatra = "Unknown";
    if (moonPlanet) {
      moonNakshatra = calculateMoonNakshatra(moonPlanet.longitude);
    }
    
    // Calculate Lunar Day (Tithi)
    let lunarDay = 1;
    if (moonPlanet && sunPlanet) {
      lunarDay = calculateLunarDay(moonPlanet.longitude, sunPlanet.longitude);
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
