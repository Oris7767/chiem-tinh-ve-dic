import { DateTime } from 'luxon';

// Types (Keep existing types, may need adjustment later based on API response)
export type Planet = {
  id: string; // e.g., "su", "mo"
  name: string; // e.g., "Sun", "Moon"
  symbol: string; // e.g., "☉", "☽"
  longitude: number; // Nirayana longitude
  house: number; // House number (1-12)
  sign: number; // Sign index (0-11, Aries=0)
  retrograde: boolean;
  color: string; // Color for display
};

export type House = {
  number: number; // 1-12
  longitude: number; // Cusp longitude (start of the house)
  sign: number; // Sign index (0-11)
};

export type ChartData = {
  planets: Planet[];
  houses: House[];
  ascendant: number; // Ascendant longitude
  moonNakshatra: string; // Name of Moon's Nakshatra
  lunarDay: number; // Tithi number (1-30)
};

// Constants (Keep existing constants)
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

// Keep PLANETS for mapping symbols and colors, but remove calculations
export const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFB900" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#DDDDDD" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#33CC33" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FF66FF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF3300" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFCC00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#0066CC" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#666666" }, // North Node
  { id: "ke", name: "Ketu", symbol: "☋", color: "#996633" }  // South Node
];

// Map API planet names/keys to our internal IDs if needed
const API_PLANET_MAP: Record<string, string> = {
  "sun": "su",
  "moon": "mo",
  "mercury": "me",
  "venus": "ve",
  "mars": "ma",
  "jupiter": "ju",
  "saturn": "sa",
  "north_node": "ra", // Assuming API uses 'north_node' for Rahu
  "south_node": "ke", // Assuming API uses 'south_node' for Ketu
  // Add other mappings if the API uses different keys/names
};

// Helper to find planet details (symbol, color) by ID
const getPlanetDetails = (id: string) => {
    return PLANETS.find(p => p.id === id) || { symbol: '?', color: '#000000', name: 'Unknown' };
};


// --- NEW API Fetching Function ---
const API_KEY = "qqgGvpWGpl3D30KKDm7Ej8mJiPDMg6il8a3K4pjj"; // !!! INSECURE - Use env var or backend proxy
const API_BASE_URL = "https://json.freeastrologyapi.com";

export const fetchChartDataFromAPI = async (
  birthDateTime: DateTime, // Changed parameter name for clarity
  latitude: number,
  longitude: number
  // timezone is derived from birthDateTime
): Promise<ChartData | null> => {

  // API requires timezone offset in hours (e.g., 7 for GMT+7)
  const timezoneOffsetHours = birthDateTime.offset / 60;

  // Construct the API URL (Endpoint needs verification - using a guess)
  // Parameters also need verification based on API docs
  const endpoint = `${API_BASE_URL}/v1/vedic_chart_data/`; // <--- VERIFY THIS ENDPOINT
  const params = new URLSearchParams({
    day: birthDateTime.toFormat('dd'),
    month: birthDateTime.toFormat('MM'),
    year: birthDateTime.toFormat('yyyy'),
    hour: birthDateTime.toFormat('HH'),
    min: birthDateTime.toFormat('mm'),
    lat: latitude.toString(),
    lon: longitude.toString(),
    tzone: timezoneOffsetHours.toString(), // API might need IANA name instead, verify!
    // ayanamsa: 'lahiri', // Specify ayanamsa if possible, verify parameter name
  });

  const url = `${endpoint}?${params.toString()}`;

  console.log("Fetching chart data from:", url); // For debugging

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // Verify the correct header for API key authentication
        'X-Api-Key': API_KEY,
        // 'Authorization': `Bearer ${API_KEY}`, // Alternative if required
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API Error (${response.status}): ${errorData}`);
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }

    const apiData = await response.json();
    console.log("API Response:", apiData); // For debugging

    // --- Map API data to our ChartData structure ---
    // !!! This mapping is based on assumptions and NEEDS verification
    // !!! based on the actual structure of apiData

    const planets: Planet[] = (apiData.planets || []).map((apiPlanet: any) => {
        const planetId = API_PLANET_MAP[apiPlanet.name?.toLowerCase()] || 'unknown'; // Map name to ID
        const details = getPlanetDetails(planetId);
        return {
            id: planetId,
            name: details.name, // Use our name
            symbol: details.symbol, // Use our symbol
            longitude: parseFloat(apiPlanet.full_degree || 0), // Verify field name
            house: parseInt(apiPlanet.house || 0, 10),      // Verify field name
            sign: parseInt(apiPlanet.sign_id || 0, 10),      // Verify field name (assuming 0=Aries)
            retrograde: apiPlanet.is_retro === 'true' || apiPlanet.is_retro === true, // Verify field name and value type
            color: details.color, // Use our color
        };
    }).filter((p: Planet) => p.id !== 'unknown'); // Filter out unmapped planets

    // Assuming API provides house cusps (start longitude)
    // Adjusting mapping based on common API structures: often returns 12 cusp degrees
    const houses: House[] = (apiData.house_cusps?.degrees || []).slice(0, 12).map((cuspLongitude: number, index: number) => {
        const signIndex = Math.floor(cuspLongitude / 30);
        return {
            number: index + 1,
            longitude: cuspLongitude,
            sign: signIndex,
        };
    });
    // If API doesn't return house_cusps, we might need a different approach or leave houses empty
    if (houses.length !== 12 && apiData.ascendant) { 
        // Fallback: Could potentially generate whole sign houses from ascendant sign
        console.warn("API did not return 12 house cusps. House data might be incomplete or inaccurate.");
        // Example whole sign house generation (adjust if needed)
        // const ascendantSign = Math.floor(parseFloat(apiData.ascendant.full_degree || 0) / 30);
        // houses = Array.from({ length: 12 }, (_, i) => ({
        //     number: i + 1,
        //     sign: (ascendantSign + i) % 12,
        //     longitude: ((ascendantSign + i) % 12) * 30 // Simplified longitude
        // }));
    }

    const ascendant = parseFloat(apiData.ascendant?.full_degree || 0); // Verify field name

    // Nakshatra might be provided by name or index
    let moonNakshatra = "Unknown";
    const nakshatraData = apiData.moon_details?.nakshatra; // Verify field names
    if (nakshatraData) {
        const moonNakshatraIndex = parseInt(nakshatraData.nakshatra_id || -1, 10); // Verify field name
        if (moonNakshatraIndex >= 0 && moonNakshatraIndex < NAKSHATRAS.length) {
            moonNakshatra = NAKSHATRAS[moonNakshatraIndex];
        } else if (nakshatraData.name) {
            moonNakshatra = nakshatraData.name; // Use name from API if index is bad
        }
    }

    // Tithi might be provided by name or number
    const tithiData = apiData.panchanga?.tithi?.details; // Verify field names
    const lunarDay = parseInt(tithiData?.tithi_number || 0, 10);

    return {
      planets,
      houses,
      ascendant,
      moonNakshatra,
      lunarDay,
    };

  } catch (error) {
    console.error("Error fetching or processing chart data:", error);
    return null; // Return null on error
  }
};

// Helper function to get planet abbreviation (Keep this)
export const getPlanetAbbr = (planetName: string): string => {
  // Find the planet in our PLANETS array to get its abbreviation (id)
  const planet = PLANETS.find(p => p.name === planetName);
  if (planet) {
      // Make it uppercase for display if needed, e.g., Su, Mo
      return planet.id.charAt(0).toUpperCase() + planet.id.slice(1);
  }
  // Fallback for names not in our list (like 'Ascendant')
  const abbrs: Record<string, string> = { 'Ascendant': 'As' };
  return abbrs[planetName] || planetName.substring(0, 2);
};