
import { DateTime } from 'luxon';
import { supabase } from '@/integrations/supabase/client';
import { DashaResult } from '@/components/VedicAstrology/DashaCalculator';

interface DashaReference {
  planet: string;
  symbol: string;
  mahadasha_years: number;
  planetary_info?: Record<string, string>;
  dasha_effects?: Record<string, string>;
  antardasha_percentages?: Record<string, number>;
}

// The order of planets in Vimshottari Dasha system
const DASHA_PLANET_ORDER = [
  'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'
];

// Mapping nakshatras to their ruling planets for dasha calculation
const NAKSHATRA_RULERS: Record<string, string> = {
  'Ashwini': 'Ketu',
  'Bharani': 'Venus',
  'Krittika': 'Sun',
  'Rohini': 'Moon',
  'Mrigashira': 'Mars',
  'Ardra': 'Rahu',
  'Punarvasu': 'Jupiter',
  'Pushya': 'Saturn',
  'Ashlesha': 'Mercury',
  'Magha': 'Ketu',
  'Purva Phalguni': 'Venus',
  'Uttara Phalguni': 'Sun',
  'Hasta': 'Moon',
  'Chitra': 'Mars',
  'Swati': 'Rahu',
  'Vishakha': 'Jupiter',
  'Anuradha': 'Saturn',
  'Jyeshtha': 'Mercury',
  'Mula': 'Ketu',
  'Purva Ashadha': 'Venus',
  'Uttara Ashadha': 'Sun',
  'Shravana': 'Moon',
  'Dhanishta': 'Mars',
  'Shatabhisha': 'Rahu',
  'Purva Bhadrapada': 'Jupiter',
  'Uttara Bhadrapada': 'Saturn',
  'Revati': 'Mercury'
};

export async function calculateDashaResults(
  birthDateTime: DateTime,
  moonNakshatra: string
): Promise<DashaResult[]> {
  try {
    // Fetch dasha reference data from Supabase
    const { data: dashaData, error } = await supabase
      .from('dasha_reference')
      .select('planet, symbol, mahadasha_years');
      
    if (error) throw new Error(`Error fetching dasha reference: ${error.message}`);
    
    // Create a map of planet to its dasha years
    const planetYearsMap = new Map<string, number>();
    dashaData?.forEach((item) => {
      planetYearsMap.set(item.planet, item.mahadasha_years);
    });

    // Find the starting planet based on moon nakshatra
    const startingPlanet = NAKSHATRA_RULERS[moonNakshatra] || 'Moon'; // default to Moon if not found
    
    // Total years for the cycle (120 years in Vimshottari system)
    const totalCycleYears = 120;
    
    // Calculate birth dasha balance
    // This is a simplified calculation, in reality it depends on the position of Moon within the nakshatra
    const birthDashaBalanceYears = 5; // Simplified: assuming 5 years balance at birth
    
    // Generate dasha periods
    const dashaResults: DashaResult[] = [];
    let currentDate = birthDateTime;
    let currentPlanetIndex = DASHA_PLANET_ORDER.indexOf(startingPlanet);
    
    // First add the balance of birth dasha
    const birthDashaPlanet = DASHA_PLANET_ORDER[currentPlanetIndex];
    const birthDashaYears = planetYearsMap.get(birthDashaPlanet) || 0;
    
    const firstDashaStartDate = currentDate.toISO();
    const firstDashaEndDate = currentDate.plus({ years: birthDashaBalanceYears }).toISO();
    
    dashaResults.push({
      planet: birthDashaPlanet,
      startDate: firstDashaStartDate,
      endDate: firstDashaEndDate,
      subDashas: generateSubDashas(birthDashaPlanet, currentDate, birthDashaBalanceYears, planetYearsMap)
    });
    
    // Move to the next dasha
    currentDate = currentDate.plus({ years: birthDashaBalanceYears });
    currentPlanetIndex = (currentPlanetIndex + 1) % DASHA_PLANET_ORDER.length;
    
    // Generate the next few dashas (limiting to 5 total dashas for practicality)
    for (let i = 0; i < 4; i++) {
      const planet = DASHA_PLANET_ORDER[currentPlanetIndex];
      const years = planetYearsMap.get(planet) || 0;
      
      const startDate = currentDate.toISO();
      const endDate = currentDate.plus({ years }).toISO();
      
      dashaResults.push({
        planet,
        startDate,
        endDate,
        subDashas: generateSubDashas(planet, currentDate, years, planetYearsMap)
      });
      
      currentDate = currentDate.plus({ years });
      currentPlanetIndex = (currentPlanetIndex + 1) % DASHA_PLANET_ORDER.length;
    }
    
    return dashaResults;
  } catch (error) {
    console.error("Error in dasha calculation:", error);
    throw error;
  }
}

function generateSubDashas(
  mainPlanet: string,
  startDateTime: DateTime,
  totalYears: number,
  planetYearsMap: Map<string, number>
): DashaResult[] {
  const subDashas: DashaResult[] = [];
  let currentDate = startDateTime;
  
  // Start with the main planet's antardasha
  let currentPlanetIndex = DASHA_PLANET_ORDER.indexOf(mainPlanet);
  
  const totalCycleYears = 120;
  
  // Calculate each sub-dasha
  for (let i = 0; i < DASHA_PLANET_ORDER.length; i++) {
    const planet = DASHA_PLANET_ORDER[currentPlanetIndex];
    const mainDashaYears = planetYearsMap.get(mainPlanet) || 0;
    const subDashaYears = planetYearsMap.get(planet) || 0;
    
    // Calculate the duration of this sub-dasha
    const subDashaDuration = (mainDashaYears * subDashaYears) / totalCycleYears;
    
    const startDate = currentDate.toISO();
    const endDate = currentDate.plus({ years: subDashaDuration }).toISO();
    
    subDashas.push({
      planet,
      startDate,
      endDate
    });
    
    currentDate = currentDate.plus({ years: subDashaDuration });
    currentPlanetIndex = (currentPlanetIndex + 1) % DASHA_PLANET_ORDER.length;
  }
  
  return subDashas;
}
