import axios from 'axios';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { VEDIC_ASTRO_API_CONFIG } from '@/utils/vedicAstrology/config';

export interface PlanetaryTransit {
  planet: string;
  type: string;
  timestamp: string;
  details: {
    fromSign?: string;
    toSign?: string;
    longitude?: number;
    speed?: number;
  };
}

export interface NearestTransits {
  referenceDate: string;
  events: PlanetaryTransit[];
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
}

const TIMEOUT = 120000; // 2 minutes in milliseconds
const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh'; // GMT+7
const DEFAULT_LOCATION = {
  latitude: 21.0245,  // Hanoi coordinates
  longitude: 105.8412
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create axios instances with default config for each endpoint
const panchangApi = axios.create({
  baseURL: VEDIC_ASTRO_API_CONFIG.PANCHANG_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const transitsApi = axios.create({
  baseURL: VEDIC_ASTRO_API_CONFIG.TRANSITS_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for timeout and retry handling
const setupInterceptors = (api: any) => {
  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const config = error.config;
  
      // If no retry count is set, initialize it
      if (!config || !config.retry) {
        config.retry = VEDIC_ASTRO_API_CONFIG.MAX_RETRIES;
      }
  
      // If there are retries left and it's a network error
      if (config.retry > 0 && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
        config.retry -= 1;
        
        // Wait before retrying
        await delay(VEDIC_ASTRO_API_CONFIG.RETRY_DELAY);
        console.log(`Retrying request... (${VEDIC_ASTRO_API_CONFIG.MAX_RETRIES - config.retry}/${VEDIC_ASTRO_API_CONFIG.MAX_RETRIES})`);
        
        return api(config);
      }
  
      return Promise.reject(error);
    }
  );
};

setupInterceptors(panchangApi);
setupInterceptors(transitsApi);

// Function to get user's current position with timeout
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Set timeout for geolocation
    const timeoutId = setTimeout(() => {
      reject(new Error('Geolocation request timed out'));
    }, TIMEOUT);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve(position);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
};

export const getPanchangData = async (): Promise<PanchangData> => {
  try {
    // Get current time in local timezone
    const now = new Date();
    const date = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm');

    // Get user's location with timeout
    let latitude = DEFAULT_LOCATION.latitude;
    let longitude = DEFAULT_LOCATION.longitude;

    try {
      const position = await getCurrentPosition();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      console.warn('Could not get user location, using default coordinates:', error);
    }

    console.log('Panchang API Request:', {
      url: VEDIC_ASTRO_API_CONFIG.PANCHANG_URL,
      body: {
        date,
        time,
        latitude,
        longitude,
        timezone: DEFAULT_TIMEZONE
      }
    });

    const response = await panchangApi.post('', {
      date,
      time,
      latitude,
      longitude,
      timezone: DEFAULT_TIMEZONE
    });

    if (!response.data) {
      throw new Error('No data received from Panchang API');
    }

    console.log('Panchang API Response:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Panchang API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Panchang API request timed out after 2 minutes');
      }
    } else {
      console.error('Error fetching Panchang data:', error);
    }
    throw error;
  }
};

export const getNearestTransits = async (date: string): Promise<NearestTransits> => {
  try {
    console.log('Transit API Request:', {
      url: VEDIC_ASTRO_API_CONFIG.TRANSITS_URL,
      params: { date }
    });

    const response = await transitsApi.get('', {
      params: { date }
    });

    if (!response.data) {
      throw new Error('No data received from Transit API');
    }

    // Convert UTC timestamps to local timezone
    const processedData = {
      ...response.data,
      events: response.data.events.map((event: PlanetaryTransit) => {
        const utcDate = new Date(event.timestamp);
        const localDate = toZonedTime(utcDate, DEFAULT_TIMEZONE);
        return {
          ...event,
          timestamp: localDate.toISOString(),
        };
      }),
    };

    console.log('Transit API Response:', processedData);

    return processedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Transit API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Transit API request timed out after 2 minutes');
      }
    } else {
      console.error('Error fetching nearest transits:', error);
    }
    throw error;
  }
}; 