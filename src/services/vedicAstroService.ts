import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse } from '@/utils/vedicAstrology/config';
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
    // Log the incoming form data
    console.log('Received form data:', {
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: formData.timezone,
      location: formData.location,
      name: formData.name,
      email: formData.email
    });

    // Check if user is logged in and has a saved chart
    if (formData.email) {
      const savedChart = await fetchSavedChart(formData.email);
      if (savedChart) {
        return savedChart;
      }
    }
    
    // Format the payload according to the specified format
    const apiPayload = {
      date: formData.birthDate,
      time: formData.birthTime,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: formData.timezone
    };

    // Log the API payload
    console.log('Sending API payload:', apiPayload);
    
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
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'Lỗi không xác định'}`);
      }
      
      const apiData: VedicChartResponse = await response.json();
      
      // Log the API response
      console.log('API Response:', apiData);
      
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
      // Check if it was a timeout error
      if (fetchError.name === 'AbortError') {
        throw new Error('Quá thời gian chờ phản hồi từ máy chủ. Vui lòng thử lại sau.');
      }
      
      // Any other fetch error
      throw new Error(`Lỗi khi tính toán bản đồ sao: ${fetchError.message}`);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Convert API response format to app's VedicChartData format
 */
function convertApiResponseToChartData(apiData: VedicChartResponse): VedicChartData {
  // Ascendant
  const ascSignIdx   = SIGN_TO_INDEX[apiData.ascendant.sign] || 0;
  const ascDeg       = apiData.ascendant.degree  || 0;
  const ascLongitude = ascSignIdx * 30 + ascDeg;

  // Houses
  const houses: House[] = apiData.houses.map(h => ({
    number: h.house,
    sign: SIGN_TO_INDEX[h.sign] || 0,
    longitude: (SIGN_TO_INDEX[h.sign] || 0) * 30 + (h.degree || 0),
  }));

  // Planets
  const planets: Planet[] = apiData.planets.map(p => {
    const key       = p.planet.toUpperCase();       // p.planet hoặc p.name
    const info      = PLANET_MAP[key]  || {};
    const lon       = p.longitude;
    const degInSign = lon % 30;

    return {
      id:     info.id      || key.toLowerCase(),
      name:   info.name    || p.planet,              
      symbol: info.symbol  || "",
      color:  info.color   || "#ccc",
      sign:   SIGN_TO_INDEX[p.sign] || 0,
      longitude: lon,
      house:  p.house,
      retrograde: p.retrograde,
      // tách riêng degree nếu VedicChartData định nghĩa
      // degree: degInSign
    };
  });

  return {
    ascendant: ascLongitude,
    houses,
    planets,
    moonNakshatra: apiData.dashas?.current || apiData.ascendant.nakshatra || "",
    lunarDay: 1
  };
}
