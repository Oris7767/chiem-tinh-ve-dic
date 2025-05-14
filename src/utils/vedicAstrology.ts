
import { DateTime } from 'luxon';
import { PLANETS as PLANET_DATA, getPlanetColor, getPlanetSymbol } from './VedicAstro/Planets';
import { SIGNS as SIGN_DATA } from './VedicAstro/Signs';

// Types
export type Planet = {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
  color: string;
};

export type House = {
  number: number;
  longitude: number;
  sign: number;
};

export type ChartData = {
  planets: Planet[];
  houses: House[];
  ascendant: number;
  moonNakshatra: string;
  lunarDay: number;
};

// Constants
export const SIGNS = Object.values(SIGN_DATA).map(sign => `${sign.sanskritName} (${sign.name})`);

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

export const PLANETS = Object.values(PLANET_DATA).map(planet => ({
  id: planet.id,
  name: planet.name,
  symbol: planet.symbol,
  color: planet.color
}));

// Mock calculation functions (in a real app, these would use a proper ephemeris library like Swiss Ephemeris)
export const calculatePlanetPositions = (
  date: DateTime, 
  latitude: number, 
  longitude: number
): Planet[] => {
  // This is just a mock implementation for demonstration
  const seed = date.toMillis() + latitude + longitude;
  
  return PLANETS.map(planet => {
    const randomLongitude = (seed % 1000 + parseInt(planet.id, 36)) % 360;
    const sign = Math.floor(randomLongitude / 30);
    const house = ((sign + 1) % 12) + 1;
    
    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      longitude: randomLongitude,
      sign: sign,
      house: house,
      retrograde: Math.random() > 0.8,
      color: planet.color
    };
  });
};

export const calculateHouses = (
  date: DateTime, 
  latitude: number, 
  longitude: number
): House[] => {
  // In a real app, this would use proper astronomical calculations
  const seed = date.toMillis() + latitude + longitude;
  const ascendant = seed % 360;
  
  return Array.from({ length: 12 }, (_, i) => {
    const houseLongitude = (ascendant + i * 30) % 360;
    return {
      number: i + 1,
      longitude: houseLongitude,
      sign: Math.floor(houseLongitude / 30)
    };
  });
};

export const calculateChart = (
  birthDate: DateTime, 
  latitude: number, 
  longitude: number
): ChartData => {
  const planets = calculatePlanetPositions(birthDate, latitude, longitude);
  const houses = calculateHouses(birthDate, latitude, longitude);
  const ascendant = houses[0].longitude;
  
  // Calculate Moon Nakshatra (27 nakshatras in 360 degrees)
  const moonLongitude = planets.find(p => p.id === "mo")?.longitude || 0;
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
  const moonNakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Calculate Lunar Day (Tithi) - simplified calculation
  const sunLongitude = planets.find(p => p.id === "su")?.longitude || 0;
  const lunarDay = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
  
  return {
    planets,
    houses,
    ascendant,
    moonNakshatra,
    lunarDay
  };
};

// Helper function to get planet abbreviation
export const getPlanetAbbr = (planet: string): string => {
  const abbrs: Record<string, string> = {
    'Ascendant': 'As',
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke',
  };
  return abbrs[planet] || planet.substring(0, 2);
};
