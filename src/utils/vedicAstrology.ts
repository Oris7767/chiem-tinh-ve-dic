
import { DateTime } from 'luxon';

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

export type ChartHouse = {
  number: number;
  planets: Planet[];
}

export type ChartData = {
  planets: Planet[];
  houses: House[];
  ascendant: number;
  moonNakshatra: string;
  lunarDay: number;
};

// Constants
export const SIGNS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

export const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFB900" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#DDDDDD" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#33CC33" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FF66FF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF3300" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFCC00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#0066CC" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#666666" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#996633" }
];

// Mock calculation functions (in a real app, these would use a proper ephemeris library like Swiss Ephemeris)
export const calculatePlanetPositions = (
  date: DateTime, 
  latitude: number, 
  longitude: number
): Planet[] => {

  const seed = date.toMillis() + latitude + longitude;
  return PLANETS.map(planet => {
    const randomLongitude = (seed % 1000 + parseInt(planet.id, 36)) % 360;
    // Assign signs based on longitude
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

// Function to structure the chart for South Indian style
export const getSouthIndianChart = (chartData: ChartData): ChartHouse[] => {
  const chartHouses: ChartHouse[] = [];
  const sortedPlanets = [...chartData.planets].sort((a,b) => a.longitude - b.longitude);
  
  // Create an array of 12 houses, initialized with empty planet arrays
  for (let i = 0; i < 12; i++) {
    chartHouses.push({ number: i, planets: [] });
  }
  // Populate houses with planets
  for (const planet of sortedPlanets) {
    const houseIndex = planet.sign;
    
    // Mesha (Aries) is in the 2nd house of the 4x4 grid, so adjust houses accordingly.
    const modifiedHouseIndex = (houseIndex + 1) % 12;

    chartHouses[modifiedHouseIndex].planets.push(planet);
  }
  // Adjust the houses to fit into a 4x4 grid (South Indian style)
  const southIndianChart: ChartHouse[] = [
    chartHouses[1], chartHouses[2], chartHouses[3], 
    chartHouses[0], undefined, undefined, chartHouses[4],
    chartHouses[11], undefined, undefined, chartHouses[5],
    chartHouses[10], chartHouses[9], chartHouses[8], chartHouses[7], chartHouses[6],
  ];

  return southIndianChart.filter(house => house !== undefined);
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
