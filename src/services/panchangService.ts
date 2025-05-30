import axios from 'axios';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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

const BASE_URL = 'https://vedicvn-api.onrender.com/api';
const TIMEOUT = 120000; // 2 minutes in milliseconds
const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh'; // GMT+7
const DEFAULT_LOCATION = {
  latitude: 21.0245,  // Hanoi coordinates
  longitude: 105.8412
};

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for timeout handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      throw new Error('Request timed out after 2 minutes. Please try again.');
    }
    throw error;
  }
);

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
      url: `${BASE_URL}/panchang`,
      body: {
        date,
        time,
        latitude,
        longitude,
        timezone: DEFAULT_TIMEZONE
      }
    });

    const response = await api.post('/panchang', {
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
      url: `${BASE_URL}/panchang/nearest-transits`,
      params: { date }
    });

    const response = await api.get('/panchang/nearest-transits', {
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