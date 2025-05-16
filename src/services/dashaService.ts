
import { DateTime } from 'luxon';
import { supabase } from '@/integrations/supabase/client';

export interface DashaResult {
  planet: string;
  startDate: string;
  endDate: string;
  subDashas?: DashaResult[];
}

// Dasha period years for each planet
const dashaPeriods = {
  "Sun": 6,
  "Moon": 10,
  "Mars": 7,
  "Rahu": 18,
  "Jupiter": 16,
  "Saturn": 19,
  "Mercury": 17,
  "Ketu": 7,
  "Venus": 20
};

// Planet order in Vimshottari Dasha
const planetOrder = [
  "Sun", "Moon", "Mars", "Rahu", "Jupiter", 
  "Saturn", "Mercury", "Ketu", "Venus"
];

// Nakshatra to ruling planet mapping
const nakshatraToPlanet = {
  "Ashwini": "Ketu",
  "Bharani": "Venus",
  "Krittika": "Sun",
  "Rohini": "Moon",
  "Mrigasira": "Mars",
  "Ardra": "Rahu",
  "Punarvasu": "Jupiter",
  "Pushya": "Saturn",
  "Ashlesha": "Mercury",
  "Magha": "Ketu",
  "Purva Phalguni": "Venus",
  "Uttara Phalguni": "Sun",
  "Hasta": "Moon",
  "Chitra": "Mars",
  "Swati": "Rahu",
  "Vishakha": "Jupiter",
  "Anuradha": "Saturn",
  "Jyeshtha": "Mercury",
  "Mula": "Ketu",
  "Purva Ashadha": "Venus",
  "Uttara Ashadha": "Sun",
  "Shravana": "Moon",
  "Dhanishta": "Mars",
  "Shatabhisha": "Rahu",
  "Purva Bhadrapada": "Jupiter",
  "Uttara Bhadrapada": "Saturn",
  "Revati": "Mercury"
};

// Helper function to get the next dasha planet
const getNextPlanet = (currentPlanet: string): string => {
  const currentIndex = planetOrder.indexOf(currentPlanet);
  return planetOrder[(currentIndex + 1) % planetOrder.length];
};

// Calculate the elapsed portion of birth nakshatra and dasha
const calculateElapsedBirthDasha = (birthDateTime: DateTime, moonNakshatra: string): number => {
  // In a real implementation, this would calculate the precise portion of the nakshatra traversed
  // For now, we'll use a simplified approach with random but deterministic value
  const seed = birthDateTime.toMillis();
  return (seed % 100) / 100; // Returns a value between 0 and 1
};

// Calculate Dasha results for a person
export const calculateDashaResults = async (
  birthDateTime: DateTime,
  moonNakshatra: string
): Promise<DashaResult[]> => {
  try {
    // Get initial dasha planet from moon nakshatra
    const birthDashaPlanet = nakshatraToPlanet[moonNakshatra as keyof typeof nakshatraToPlanet] || "Sun";
    
    // Calculate elapsed portion of the birth dasha
    const elapsedPortion = calculateElapsedBirthDasha(birthDateTime, moonNakshatra);
    const remainingPortion = 1 - elapsedPortion;
    
    // Calculate the remaining years in the birth dasha
    const birthDashaFullYears = dashaPeriods[birthDashaPlanet as keyof typeof dashaPeriods];
    const remainingYears = birthDashaFullYears * remainingPortion;
    
    // Generate the dasha periods
    const dashas: DashaResult[] = [];
    let currentPlanet = birthDashaPlanet;
    let currentStartDate = birthDateTime;
    
    // First add the birth dasha with remaining time
    let currentEndDate = currentStartDate.plus({ years: remainingYears });
    
    dashas.push({
      planet: currentPlanet,
      startDate: currentStartDate.toISO(),
      endDate: currentEndDate.toISO(),
      subDashas: calculateSubDashas(currentPlanet, currentStartDate, currentEndDate)
    });
    
    // Calculate 3 more dashas after the birth dasha
    for (let i = 0; i < 3; i++) {
      currentPlanet = getNextPlanet(currentPlanet);
      currentStartDate = currentEndDate;
      
      const planetFullYears = dashaPeriods[currentPlanet as keyof typeof dashaPeriods];
      currentEndDate = currentStartDate.plus({ years: planetFullYears });
      
      dashas.push({
        planet: currentPlanet,
        startDate: currentStartDate.toISO(),
        endDate: currentEndDate.toISO(),
        subDashas: calculateSubDashas(currentPlanet, currentStartDate, currentEndDate)
      });
    }

    // Save the dasha reference data in the database if not already there
    await checkAndCreateDashaReference();
    
    return dashas;
  } catch (error) {
    console.error("Error calculating dashas:", error);
    throw new Error("Failed to calculate dasha periods");
  }
};

// Calculate sub-dashas (antardasha) for a mahadasha period
const calculateSubDashas = (
  mahadashaPlanet: string,
  startDate: DateTime,
  endDate: DateTime
): DashaResult[] => {
  const subDashas: DashaResult[] = [];
  const mahadashaDuration = endDate.diff(startDate).as('milliseconds');
  const mahadashaPeriod = dashaPeriods[mahadashaPlanet as keyof typeof dashaPeriods];
  
  // Start with the mahadasha planet itself for the first sub-dasha
  let currentSubPlanet = mahadashaPlanet;
  let currentSubStart = startDate;
  
  // Calculate all sub-dashas for this mahadasha
  for (let i = 0; i < planetOrder.length; i++) {
    const subPlanetPeriod = dashaPeriods[currentSubPlanet as keyof typeof dashaPeriods];
    
    // The proportion of the mahadasha that this sub-dasha occupies
    const subDashaFraction = subPlanetPeriod / 120; // 120 is the total years of all dashas
    
    // Calculate the duration of this sub-dasha
    const subDashaDuration = mahadashaDuration * subDashaFraction;
    const subDashaEnd = new DateTime(currentSubStart).plus({ milliseconds: subDashaDuration });
    
    // Add to the list of sub-dashas
    subDashas.push({
      planet: currentSubPlanet,
      startDate: currentSubStart.toISO(),
      endDate: subDashaEnd.toISO()
    });
    
    // Move to the next planet for the next sub-dasha
    currentSubPlanet = getNextPlanet(currentSubPlanet);
    currentSubStart = subDashaEnd;
    
    // If we've gone past the end of the mahadasha, stop
    if (currentSubStart > endDate) {
      break;
    }
  }
  
  return subDashas;
};

// Check if dasha reference data exists and create it if needed
const checkAndCreateDashaReference = async () => {
  const { data } = await supabase
    .from('dasha_reference')
    .select('id')
    .limit(1);
    
  if (!data || data.length === 0) {
    // Create the dasha reference data
    const dashaReferenceData = planetOrder.map(planet => ({
      planet,
      symbol: planet.substring(0, 2),
      mahadasha_years: dashaPeriods[planet as keyof typeof dashaPeriods],
      planetary_info: { nature: "placeholder" },
      dasha_effects: { 
        good: "Placeholder positive effects", 
        bad: "Placeholder challenging effects" 
      }
    }));
    
    await supabase.from('dasha_reference').insert(dashaReferenceData);
  }
};
