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

// List of 27 Nakshatras
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

// Add type definition for database chart
interface DbBirthChart {
  created_at: string;
  houses: Json;
  id: string;
  nakshatras: Json;
  planets: Json;
  user_id: string;
  metadata?: Json;
  dashas?: Json;
}

interface AntarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
}

interface DashaData {
  current: {
    planet: string;
    startDate: string;
    endDate: string;
    elapsed: { years: number; months: number; days: number; };
    remaining: { years: number; months: number; days: number; };
    antardasha: {
      current: {
        planet: string;
        startDate: string;
        endDate: string;
        elapsed: { years: number; months: number; days: number; };
        remaining: { years: number; months: number; days: number; };
      };
      sequence: Array<{
        planet: string;
        startDate: string;
        endDate: string;
        pratyantardasha?: Array<{
          planet: string;
          startDate: string;
          endDate: string;
        }>;
      }>;
    };
  };
  sequence: Array<{ planet: string; startDate: string; endDate: string; }>;
}

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
    const chartData = charts[0] as DbBirthChart;

    // Parse the stored JSON data properly
    const planets = safeParseJson<Planet[]>(chartData.planets, []);
    const houses = safeParseJson<House[]>(chartData.houses, []);
    const nakshatras = safeParseJson<{
      moonNakshatra: string;
      ascendantNakshatra: NakshatraInfo;
    }>(chartData.nakshatras, {
      moonNakshatra: '',
      ascendantNakshatra: {
        name: '',
        lord: '',
        startDegree: 0,
        endDegree: 0,
        pada: 1
      }
    });
    const metadata = safeParseJson<ChartMetadata>(chartData.metadata || null, {
      ayanamsa: 24,
      date: '',
      time: '',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
      houseSystem: 'W'
    });
    const dashas = safeParseJson<DashaData>(chartData.dashas || null, {
      current: {
        planet: '',
        startDate: '',
        endDate: '',
        elapsed: { years: 0, months: 0, days: 0 },
        remaining: { years: 0, months: 0, days: 0 },
        antardasha: {
          current: {
            planet: '',
            startDate: '',
            endDate: '',
            elapsed: { years: 0, months: 0, days: 0 },
            remaining: { years: 0, months: 0, days: 0 }
          },
          sequence: []
        }
      },
      sequence: []
    });

    return {
      ascendant: houses[0]?.longitude || 0,
      ascendantNakshatra: nakshatras.ascendantNakshatra,
      planets,
      houses,
      moonNakshatra: nakshatras.moonNakshatra,
      lunarDay: 1,
      metadata,
      dashas
    };
  } catch (error) {
    console.error("Error fetching saved chart:", error);
    return null;
  }
}

/**
 * Handle API request with timeout and retry logic
 */
async function fetchWithTimeoutAndRetry(url: string, options: RequestInit, timeout: number, maxRetries: number, retryDelay: number): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);

        // If response is not ok but it's a 500 error, we can retry
        if (!response.ok && response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }

        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    } catch (error) {
      lastError = error as Error;

      // Don't wait on the last attempt
      if (attempt < maxRetries - 1) {
        // Add some jitter to the retry delay to prevent all retries happening at exactly the same time
        const jitter = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, retryDelay + jitter));
      }
    }
  }

  throw lastError || new Error('Maximum retries exceeded');
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
      // Use fetchWithTimeoutAndRetry to handle retries and timeouts
      const response = await fetchWithTimeoutAndRetry(
        VEDIC_ASTRO_API_CONFIG.API_URL, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(apiPayload)
        },
        VEDIC_ASTRO_API_CONFIG.API_TIMEOUT,
        VEDIC_ASTRO_API_CONFIG.MAX_RETRIES,
        VEDIC_ASTRO_API_CONFIG.RETRY_DELAY
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        // Provide more specific error messages based on status code
        switch (response.status) {
          case 400:
            throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.');
          case 401:
            throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Không có quyền thực hiện thao tác này.');
          case 404:
            throw new Error('Không tìm thấy dịch vụ. Vui lòng thử lại sau.');
          case 429:
            throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.');
          case 500:
            throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
          default:
            throw new Error(`Lỗi không xác định (${response.status}): ${errorText || 'Không có thông tin chi tiết'}`);
        }
      }

      const apiData: VedicChartResponse = await response.json();

      // Log the API response
      console.log('API Response:', apiData);

      // Convert API response to VedicChartData format
      const data = convertApiResponseToChartData(apiData);

      // Save the chart data for logged in users
      const { data: { user } } = await supabase.auth.getUser();
      if (user && formData.email) {
        await supabase.from('birth_charts').insert([{
          user_id: user.id,
          planets: JSON.stringify(data.planets),
          houses: JSON.stringify(data.houses),
          nakshatras: JSON.stringify({ moonNakshatra: data.moonNakshatra }),
          metadata: JSON.stringify(data.metadata),
          dashas: JSON.stringify(data.dashas)
        }]);
      }

      return data;
    } catch (fetchError) {
      // Check if it was a timeout error
      if (fetchError.name === 'AbortError') {
        throw new Error('Quá thời gian chờ phản hồi từ máy chủ (3 phút). Vui lòng thử lại sau.');
      }

      // Network error
      if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
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
  const ascSignIdx = SIGN_TO_INDEX[apiData.ascendant.sign.name] || 0;
  const ascDeg = apiData.ascendant.sign.degree || 0;
  const ascLongitude = ascSignIdx * 30 + ascDeg;

  // Planets with aspects and nakshatra info first
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

  // Houses with planets - convert planet names to IDs
  const houses: House[] = apiData.houses.map(h => ({
    number: h.number,
    sign: SIGN_TO_INDEX[h.sign] || 0,
    longitude: (SIGN_TO_INDEX[h.sign] || 0) * 30 + (h.degree || 0),
    planets: (h.planets || []).map(planetName => {
      const key = planetName.toUpperCase();
      const info = PLANET_MAP[key] || {};
      return info.id || key.toLowerCase();
    })
  }));

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
    antardasha: {
      current: currentDasha.antardasha?.current || {
        planet: '',
        startDate: '',
        endDate: '',
        elapsed: { years: 0, months: 0, days: 0 },
        remaining: { years: 0, months: 0, days: 0 }
      },
      sequence: currentDasha.antardasha?.sequence || []
    }
  };

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
      sequence: apiData.dashas.sequence
    }
  };
}

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