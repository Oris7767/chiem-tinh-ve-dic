
import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse } from '@/utils/vedicAstrology/config';
import { VedicChartData, Planet, House } from '@/components/VedicAstrology/VedicChart';
import { supabase } from '@/integrations/supabase/client';
import { DateTime } from 'luxon';
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
 * Safely parse stored JSON data into the expected format
 */
function safeParseJson<T>(jsonData: Json | null, defaultValue: T): T {
  if (!jsonData) return defaultValue;
  
  try {
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData) as T;
    } else if (Array.isArray(jsonData)) {
      return jsonData as unknown as T;
    } else if (typeof jsonData === 'object') {
      return jsonData as unknown as T;
    } 
    return defaultValue;
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return defaultValue;
  }
}

/**
 * Fetch a saved chart for the current user if available
 */
async function fetchSavedChart(email: string): Promise<VedicChartData | null> {
  try {
    // First get the user id by email
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Fetch the latest chart for this user
    const { data: charts, error } = await supabase
      .from('birth_charts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error || !charts || charts.length === 0) {
      return null;
    }
    
    // Convert the stored chart data to the expected format
    const chartData = charts[0];
    
    // Parse the stored JSON data properly
    const planets = safeParseJson<Planet[]>(chartData.planets, []);
    const houses = safeParseJson<House[]>(chartData.houses, []);
    const nakshatras = safeParseJson<{moonNakshatra: string}>(chartData.nakshatras, { moonNakshatra: '' });
    
    return {
      ascendant: houses[0]?.longitude || 0,
      planets,
      houses,
      moonNakshatra: nakshatras.moonNakshatra || '',
      lunarDay: 1 // Default if not stored
    };
  } catch (error) {
    console.error("Error fetching saved chart:", error);
    return null;
  }
}

/**
 * Handle API request with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Convert local time to UTC time
 */
function convertToUTC(date: string, time: string, timezone: string): { utcDate: string, utcTime: string } {
  // Create a DateTime object in the specified timezone
  const dt = DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: timezone });
  
  // Convert to UTC
  const utcDt = dt.toUTC();
  
  // Format output
  const utcDate = utcDt.toFormat('yyyy-MM-dd');
  const utcTime = utcDt.toFormat('HH:mm');
  
  return { utcDate, utcTime };
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
  name?: string;
  email?: string;
}): Promise<VedicChartData> {
  try {
    // Check if user is logged in and has a saved chart
    if (formData.email) {
      const savedChart = await fetchSavedChart(formData.email);
      if (savedChart) {
        console.log("Using saved chart for user:", formData.email);
        return savedChart;
      }
    }
    
    // Prepare request object for the API
    const request: VedicChartRequest = {
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      // Format data according to API requirements
      date: formData.birthDate,
      time: formData.birthTime,
      latitude: formData.latitude, 
      longitude: formData.longitude,
      timezone: formData.timezone,
      name: formData.name,
      email: formData.email
    };
    
    console.log("Calculating chart with data:", request);
    console.log("Calling Vedic Astrology API at:", VEDIC_ASTRO_API_CONFIG.API_URL);
    
    // Convert local time to UTC
    const { utcDate, utcTime } = convertToUTC(
      formData.birthDate, 
      formData.birthTime, 
      formData.timezone
    );
    
    // Format the payload according to the specified format
    const apiPayload = {
      date: utcDate,
      time: utcTime,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: "UTC" // Always UTC since we've converted the time
    };
    
    console.log("Sending payload to API:", apiPayload);
    
    try {
      // Use fetchWithTimeout to set a maximum waiting time
      const response = await fetchWithTimeout(
        VEDIC_ASTRO_API_CONFIG.API_URL, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(apiPayload)
        },
        VEDIC_ASTRO_API_CONFIG.API_TIMEOUT
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'Lỗi không xác định'}`);
      }
      
      const apiData: VedicChartResponse = await response.json();
      console.log("API response received:", apiData);
      
      // Convert API response to VedicChartData format
      const data = convertApiResponseToChartData(apiData);
      
      // Save the chart data for logged in users
      const { data: { user } } = await supabase.auth.getUser();
      if (user && formData.email) {
        await supabase.from('birth_charts').insert({
          user_id: user.id,
          planets: data.planets,
          houses: data.houses,
          nakshatras: { moonNakshatra: data.moonNakshatra }
        });
      }
      
      return data;
    } catch (fetchError) {
      console.error("API call failed:", fetchError);
      
      // Check if it was a timeout error
      if (fetchError.name === 'AbortError') {
        throw new Error('Quá thời gian chờ phản hồi từ máy chủ. Vui lòng thử lại sau.');
      }
      
      // Any other fetch error
      throw new Error(`Lỗi khi tính toán bản đồ sao: ${fetchError.message}`);
    }
  } catch (error) {
    console.error("Error calculating chart:", error);
    throw error;
  }
}

/**
 * Convert API response format to app's VedicChartData format
 */
function convertApiResponseToChartData(apiData: VedicChartResponse): VedicChartData {
  // Convert ascendant data
  const ascendantSign = SIGN_TO_INDEX[apiData.ascendant.sign] || 0;
  const ascendantDegree = apiData.ascendant.degree || 0;
  const ascendantLongitude = ascendantSign * 30 + ascendantDegree;
  
  // Convert houses data
  const houses: House[] = apiData.houses.map(house => {
    const signIndex = SIGN_TO_INDEX[house.sign] || 0;
    return {
      number: house.house,
      longitude: signIndex * 30 + (house.degree || 0),
      sign: signIndex
    };
  });
  
  // For now, planets array may be empty from API
  const planets: Planet[] = [];
  
  // If we have dasha data, extract the current dasha planet for display
  const currentDashaInfo = apiData.dashas?.current || '';
  
  return {
    ascendant: ascendantLongitude,
    planets: planets,
    houses: houses,
    moonNakshatra: apiData.ascendant.nakshatra || '',
    lunarDay: 1 // Default value as this isn't in the current API response
  };
}
