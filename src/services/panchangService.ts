import axios from 'axios';

export interface PlanetaryTransit {
  planet: string;
  fromSign: string;
  toSign: string;
  date: string;
  time: string;
}

export interface PanchangData {
  date: string;               // ISO date string
  lunarDay: number;          // 1-30
  lunarMonth: number;        // 1-12
  lunarYear: number;         // Lunar calendar year
  sunriseTime: string;       // Local sunrise time
  sunsetTime: string;        // Local sunset time
  moonriseTime: string;      // Local moonrise time
  moonsetTime: string;       // Local moonset time
  tithi: string;            // Name of the tithi
  nakshatra: string;        // Name of the nakshatra
  yoga: string;             // Name of the yoga
  karana: string;           // Name of the karana
  recentTransits?: PlanetaryTransit[];  // Recent planetary transits
}

const API_URL = 'https://vedicvn-api.onrender.com/api/v1';

// Function to get user's current position
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

export const getPanchangData = async (date: string): Promise<PanchangData> => {
  try {
    // Get current time in ISO format
    const now = new Date();
    const isoDateTime = now.toISOString();

    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get user's location
    let latitude = 21.0245; // Default to Hanoi coordinates
    let longitude = 105.8412;

    try {
      const position = await getCurrentPosition();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      console.warn('Could not get user location, using default coordinates:', error);
    }

    console.log('API Request:', {
      url: `${API_URL}/panchang/daily`,
      params: { 
        datetime: isoDateTime,
        lat: latitude,
        lng: longitude,
        timezone
      }
    });

    const response = await axios.get(`${API_URL}/panchang/daily`, {
      params: { 
        datetime: isoDateTime,
        lat: latitude,
        lng: longitude,
        timezone
      }
    });

    console.log('API Response:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params
      });
    } else {
      console.error('Error fetching Panchang data:', error);
    }
    throw error;
  }
}; 