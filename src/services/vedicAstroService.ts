import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse, PlanetaryPosition, NakshatraInfo, ChartMetadata } from '@/utils/vedicAstrology/config';
import { VedicChartData, Planet, House } from '@/components/VedicAstrology/VedicChart';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Constants for zodiac signs
const SIGNS = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
];

const SIGN_TO_INDEX: Record<string, number> = {
  "Aries": 0, 
  "Taurus": 1, 
  "Gemini": 2, 
  "Cancer": 3, 
  "Leo": 4, 
  "Virgo": 5,
  "Libra": 6, 
  "Scorpio": 7, 
  "Sagittarius": 8, 
  "Capricorn": 9, 
  "Aquarius": 10, 
  "Pisces": 11
};

// Planets data
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#E25822" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#D3D3D3" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#00A36C" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#BF40BF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF0000" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFD700" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#696969" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#ADD8E6" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#CD7F32" }
];

// Map planet name to its data
const PLANET_MAP: Record<string, any> = {
  "SUN": { id: "su", name: "Sun", symbol: "☉", color: "#E25822" },
  "MOON": { id: "mo", name: "Moon", symbol: "☽", color: "#D3D3D3" },
  "MERCURY": { id: "me", name: "Mercury", symbol: "☿", color: "#00A36C" },
  "VENUS": { id: "ve", name: "Venus", symbol: "♀", color: "#BF40BF" },
  "MARS": { id: "ma", name: "Mars", symbol: "♂", color: "#FF0000" },
  "JUPITER": { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFD700" },
  "SATURN": { id: "sa", name: "Saturn", symbol: "♄", color: "#696969" },
  "RAHU": { id: "ra", name: "Rahu", symbol: "☊", color: "#ADD8E6" },
  "KETU": { id: "ke", name: "Ketu", symbol: "☋", color: "#CD7F32" }
};

/**
 * Calculate Lunar Day (Tithi) based on Sun and Moon positions
 */
function calculateLunarDay(planets: PlanetaryPosition[]): number {
  const sun = planets.find(p => p.planet === 'SUN');
  const moon = planets.find(p => p.planet === 'MOON');
  
  if (!sun || !moon) return 1;
  
  const sunLongitude = sun.longitude;
  const moonLongitude = moon.longitude;
  return Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
}

/**
 * Convert API response format to app's VedicChartData format
 */
function convertApiResponseToChartData(apiData: VedicChartResponse): VedicChartData {
  // Ascendant
  const ascSignIdx = SIGN_TO_INDEX[apiData.ascendant.sign.name] || 0;
  const ascDeg = apiData.ascendant.sign.degree || 0;
  const ascLongitude = ascSignIdx * 30 + ascDeg;

  // Houses with planets
  const houses: House[] = apiData.houses.map(h => ({
    number: h.number,
    sign: SIGN_TO_INDEX[h.sign] || 0,
    longitude: (SIGN_TO_INDEX[h.sign] || 0) * 30 + (h.degree || 0),
    planets: h.planets || []
  }));

  // Planets with aspects and nakshatra info
  const planets: Planet[] = apiData.planets.map(p => {
    const key = p.planet.toUpperCase();
    const info = PLANET_MAP[key] || {};
    
    return {
      id: info.id || key.toLowerCase(),
      name: info.name || p.planet,
      symbol: info.symbol || "",
      color: info.color || "#ccc",
      longitude: p.longitude,
      latitude: p.latitude,
      longitudeSpeed: p.longitudeSpeed,
      sign: SIGN_TO_INDEX[p.sign.name] || 0,
      house: p.house.number,
      retrograde: p.isRetrograde,
      nakshatra: p.nakshatra,
      aspectingPlanets: p.aspectingPlanets || [],
      aspects: (p.aspects || []).map(a => ({
        planet: a.planet,
        type: a.aspect,
        orb: a.orb
      }))
    };
  });

  // Find Moon's nakshatra
  const moon = planets.find(p => p.id === 'mo');
  const moonNakshatra = moon?.nakshatra.name || apiData.dashas?.current?.planet || "";

  // Ensure elapsed and remaining are always present in current dasha
  const currentDasha = apiData.dashas.current;
  const normalizedCurrentDasha = {
    planet: currentDasha.planet,
    startDate: currentDasha.startDate,
    endDate: currentDasha.endDate,
    elapsed: currentDasha.elapsed || { years: 0, months: 0, days: 0 },
    remaining: currentDasha.remaining || { years: 0, months: 0, days: 0 },
    antardasha: currentDasha.antardasha || null
  };

  // Normalize sequence data to include antardasha
  const normalizedSequence = apiData.dashas.sequence.map(dasha => ({
    ...dasha,
    antardasha: dasha.antardasha || null
  }));

  return {
    ascendant: ascLongitude,
    ascendantNakshatra: apiData.ascendant.nakshatra,
    planets,
    houses,
    moonNakshatra,
    lunarDay: calculateLunarDay(apiData.planets),
    metadata: apiData.metadata,
    dashas: {
      current: normalizedCurrentDasha,
      sequence: normalizedSequence
    }
  };
}

export { convertApiResponseToChartData, calculateLunarDay }; 