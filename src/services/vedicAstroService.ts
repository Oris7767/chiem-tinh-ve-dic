
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

// Planets data
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#000000" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#000000" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#000000" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#000000" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#000000" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#000000" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#000000" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#000000" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#000000" }
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
    
    // Format the payload according to the specified format
    const apiPayload = {
      date: formData.birthDate,
      time: formData.birthTime,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: formData.timezone
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
      
      const data: VedicChartResponse = await response.json();
      console.log("API response received:", data);
      
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
      
      return data as VedicChartData;
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
