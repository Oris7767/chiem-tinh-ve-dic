import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse } from '@/utils/vedicAstrology/config';
import { VedicChartData } from '@/components/VedicAstrology/VedicChart';

// Constants for zodiac signs
const SIGNS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

// Planets data
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFA500" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#SILVER" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#00FF00" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FFFFFF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF0000" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFFF00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#000080" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#4B0082" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#800000" }
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
 * Calculate Julian Day Number from date components
 * Based on the logic from VedAstro repository
 */
function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  // Algorithm from Astronomical Algorithms by Jean Meeus
  let y = year;
  let m = month;
  
  // January and February are counted as months 13 and 14 of the previous year
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  // Calculate the day including time
  const d = day + hour / 24.0 + minute / 1440.0;
  
  // Calculate A and B terms for Julian Day formula
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  // Calculate Julian Day
  const jd = Math.floor(365.25 * (y + 4716)) + 
            Math.floor(30.6001 * (m + 1)) + 
            d + b - 1524.5;
            
  return jd;
}

/**
 * Generate fallback chart data for development purposes
 * This will be replaced with actual server calculations later
 */
function generateFallbackChart(request: VedicChartRequest): VedicChartResponse {
  const dateTime = new Date(`${request.birthDate}T${request.birthTime}`);
  const timestamp = dateTime.getTime();
  const seed = timestamp + request.latitude + request.longitude;
  
  // Calculate a deterministic but fake ascendant
  const ascendant = (seed % 360);
  
  // Generate planet positions
  const planets = PLANETS.map(planet => {
    const randomOffset = (parseInt(planet.id, 36) * 31) % 360;
    const longitude = (seed + randomOffset) % 360;
    const sign = Math.floor(longitude / 30);
    
    // Calculate house based on planet position relative to ascendant
    let houseNumber = Math.floor((longitude - ascendant + 360) / 30) + 1;
    if (houseNumber > 12) houseNumber -= 12;
    
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
    const houseNumber = i + 1;
    const houseLongitude = (ascendant + (i * 30)) % 360;
    const sign = Math.floor(houseLongitude / 30);
    
    return {
      number: houseNumber,
      longitude: houseLongitude,
      sign: sign
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

/**
 * Calculate Vedic chart based on birth information
 */
export async function calculateVedicChart(formData: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
}): Promise<VedicChartData> {
  try {
    // Prepare request object for the API
    const request: VedicChartRequest = {
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      latitude: formData.latitude, 
      longitude: formData.longitude,
      timezone: formData.timezone
    };
    
    console.log("Calculating chart with data:", request);
    
    // If in fallback mode, use our simplified calculations
    if (VEDIC_ASTRO_API_CONFIG.FALLBACK_MODE) {
      console.log("Using fallback mode for chart calculations");
      // Wait a moment to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate fallback chart data
      const fallbackData = generateFallbackChart(request);
      return fallbackData as VedicChartData;
    }
    
    // Otherwise, make a real API call to the Swiss Ephemeris server
    console.log("Calling Swiss Ephemeris API at:", VEDIC_ASTRO_API_CONFIG.API_URL);
    
    try {
      const response = await fetch(VEDIC_ASTRO_API_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
      
      const data: VedicChartResponse = await response.json();
      console.log("API response received:", data);
      return data as VedicChartData;
      
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      
      // If API call fails, fall back to client-side calculation
      console.log("API call failed, using fallback calculation");
      const fallbackData = generateFallbackChart(request);
      return fallbackData as VedicChartData;
    }
    
  } catch (error) {
    console.error("Error calculating chart:", error);
    throw error;
  }
}
