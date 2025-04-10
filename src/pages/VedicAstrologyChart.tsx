import { DateTime } from 'luxon';

// Types (Keep existing types: Planet, House, ChartData)
export type Planet = {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  house: number;
  sign: number; // 0 = Aries, 1 = Taurus, ... 11 = Pisces
  retrograde: boolean;
  color: string;
};

export type House = {
  number: number;
  longitude: number; // Cusp longitude
  sign: number;     // Sign index of the cusp
};

export type ChartData = {
  planets: Planet[];
  houses: House[];
  ascendant: number; // Ascendant longitude
  moonNakshatra: string;
  lunarDay: number; // Tithi number
};

// Constants (Keep existing constants: SIGNS, NAKSHATRAS, PLANETS)
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

// Add Abhijit if needed by API data
// export const NAKSHATRAS = [...NAKSHATRAS_BASE, "Abhijit"];

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

// Helper to get planet details by ID
const getPlanetDetails = (id: string) => {
    return PLANETS.find(p => p.id === id) || { id: 'unknown', name: 'Unknown', symbol: '?', color: '#888888' };
};

// Mapping from potential API planet names to our IDs
const API_PLANET_MAP: Record<string, string> = {
    'sun': 'su',
    'moon': 'mo',
    'mercury': 'me',
    'venus': 've',
    'mars': 'ma',
    'jupiter': 'ju',
    'saturn': 'sa',
    'rahu': 'ra', // Assuming API uses 'rahu' for North Node
    'ketu': 'ke', // Assuming API uses 'ketu' for South Node
    'north node': 'ra',
    'south node': 'ke',
    'ascendant': 'asc' // Special case for ascendant if returned as a 'planet'
};


// --- New function to fetch data from API ---
export const fetchChartDataFromAPI = async (
  birthDate: string, // "yyyy-MM-dd"
  birthTime: string, // "HH:mm"
  latitude: number,
  longitude: number,
  timezone: string // e.g., "Asia/Ho_Chi_Minh"
): Promise<ChartData | null> => {
    const API_KEY = "qqgGvpWGpl3D30KKDm7Ej8mJiPDMg6il8a3K4pjj"; // Your API Key
    const BASE_URL = "https://json.freeastrologyapi.com";

    // Parse date/time using Luxon to easily get components
    const dt = DateTime.fromFormat(`${birthDate} ${birthTime}`, "yyyy-MM-dd HH:mm", { zone: timezone });
    if (!dt.isValid) {
        console.error("Invalid date/time format:", dt.invalidReason, dt.invalidExplanation);
        return null;
    }

    // Adjust timezone representation if needed by API (e.g., +7, -5)
    // const tzOffsetHours = dt.offset / 60; // Get offset in hours

    // --- Construct API URL (ASSUMPTIONS MADE HERE) ---
    // Assuming endpoint like /v1/vedic_chart or similar
    // Assuming parameters like day, month, year, hour, min, lat, lon, tzone
    // **CHECK API DOCUMENTATION FOR CORRECT ENDPOINT AND PARAMETERS**
    const params = new URLSearchParams({
        day: dt.day.toString(),
        month: dt.month.toString(),
        year: dt.year.toString(),
        hour: dt.hour.toString(),
        min: dt.minute.toString(),
        lat: latitude.toString(),
        lon: longitude.toString(),
        tzone: (dt.offset / 60).toString(), // API might expect numeric offset
        // ayanamsa: 'lahiri', // Specify Ayanamsa if possible/needed
        // house_system: 'sripati' // Specify House System if possible/needed
    });

    // **GUESSING THE ENDPOINT - REPLACE WITH ACTUAL ONE**
    const endpoint = "/v1/vedic"; // Example: might be /v1/vedic_chart, /v1/astrodata/vedic etc.
    const fullUrl = `${BASE_URL}${endpoint}?${params.toString()}`;

    console.log("Calling API:", fullUrl); // For debugging

    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-key': API_KEY // Using x-api-key header (check API docs)
                // 'Authorization': `Bearer ${API_KEY}` // Alternative header (check API docs)
            }
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            try {
                const errorBody = await response.json();
                console.error("API Error Body:", errorBody);
            } catch (e) {
                console.error("Could not parse error body.");
            }
            return null;
        }

        const apiData = await response.json();
        console.log("API Response:", apiData); // For debugging

        // --- Map API data to our ChartData structure ---
        // !!! This mapping is based on assumptions and NEEDS verification
        // !!! based on the actual structure of apiData (check the console log above!)

        // Planets Mapping
        const planets: Planet[] = (apiData.planets || apiData.astronomical_data?.planets || []) // Check possible keys
            .map((apiPlanet: any) => {
                const planetId = API_PLANET_MAP[apiPlanet.name?.toLowerCase()] || 'unknown'; // Map name to ID
                if (planetId === 'asc') return null; // Skip ascendant if it's in the planets list

                const details = getPlanetDetails(planetId);
                // **VERIFY THESE FIELD NAMES FROM apiData CONSOLE LOG**
                const longitude = parseFloat(apiPlanet.full_degree || apiPlanet.norm_degree || apiPlanet.longitude || 0);
                const house = parseInt(apiPlanet.house || 0, 10);
                // Sign ID might be 1-based in API, adjust if needed (our SIGNS is 0-based)
                const signId = parseInt(apiPlanet.sign_id || apiPlanet.sign || 0, 10);
                const signIndex = signId > 0 ? signId - 1 : 0; // Assuming API is 1-based, adjust if 0-based

                return {
                    id: planetId,
                    name: details.name, // Use our name
                    symbol: details.symbol, // Use our symbol
                    longitude: longitude,
                    house: house,
                    sign: signIndex % 12, // Ensure sign is within 0-11
                    retrograde: apiPlanet.is_retro === 'true' || apiPlanet.is_retro === true || apiPlanet.speed < 0, // Check multiple possibilities
                    color: details.color, // Use our color
                };
            })
            .filter((p: Planet | null): p is Planet => p !== null && p.id !== 'unknown'); // Filter out nulls and unmapped planets

        // Houses Mapping (using Cusps)
        // **VERIFY THESE FIELD NAMES FROM apiData CONSOLE LOG**
        const houseCuspsInput = apiData.cusps || apiData.house_cusps?.degrees || apiData.houses?.cusps || apiData.houses; // Check multiple possibilities
        let houses: House[] = [];
        if (Array.isArray(houseCuspsInput) && houseCuspsInput.length >= 12) {
             houses = houseCuspsInput.slice(0, 12).map((cuspLongitude: number | string, index: number) => {
                const longitudeNum = typeof cuspLongitude === 'string' ? parseFloat(cuspLongitude) : cuspLongitude;
                const signIndex = Math.floor(longitudeNum / 30);
                return {
                    number: index + 1,
                    longitude: longitudeNum,
                    sign: signIndex % 12, // Ensure sign is within 0-11
                };
            });
        } else if (typeof houseCuspsInput === 'object' && houseCuspsInput !== null) {
            // Handle if cusps are keys like "1", "2", etc.
             houses = Object.entries(houseCuspsInput)
                .slice(0, 12)
                .map(([key, value]) => {
                    const houseNum = parseInt(key, 10);
                    const longitudeNum = typeof value === 'string' ? parseFloat(value as string) : value as number;
                    const signIndex = Math.floor(longitudeNum / 30);
                     return {
                        number: houseNum,
                        longitude: longitudeNum,
                        sign: signIndex % 12,
                    };
                })
                .sort((a,b) => a.number - b.number); // Ensure correct order
        }


        // Ascendant Mapping
        // **VERIFY THESE FIELD NAMES FROM apiData CONSOLE LOG**
        let ascendant = 0;
         if (houses.length > 0) {
            ascendant = houses[0].longitude;
         } else {
            // Fallback: Try to get ascendant directly if not in cusps
            ascendant = parseFloat(apiData.ascendant?.full_degree || apiData.ascendant?.norm_degree || apiData.ascendant || 0);
         }


        // Moon Nakshatra Mapping
        // **VERIFY THESE FIELD NAMES FROM apiData CONSOLE LOG**
        const moonNakshatraName = apiData.moon_nakshatra?.name || apiData.nakshatras?.moon?.name || 'Unknown Nakshatra';
        // Optional: Map API Nakshatra name to our NAKSHATRAS array if needed for consistency


        // Lunar Day (Tithi) Mapping
        // **VERIFY THESE FIELD NAMES FROM apiData CONSOLE LOG**
        const lunarDay = parseInt(apiData.tithi?.details?.tithi_number || apiData.tithi?.number || 0, 10);


        // Construct the final ChartData object
        const chartData: ChartData = {
            planets,
            houses,
            ascendant,
            moonNakshatra: moonNakshatraName,
            lunarDay,
        };

        return chartData;

    } catch (error) {
        console.error("Failed to fetch or process chart data:", error);
        return null;
    }
};


// Helper function to get planet abbreviation (Keep existing)
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

// --- Remove old mock functions ---
// calculatePlanetPositions
// calculateHouses
// calculateChart
export default VedicAstrologyChart;
