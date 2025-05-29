import axios from 'axios';

export interface PlanetaryTransit {
  planet: string;
  fromSign: string;
  toSign: string;
  date: string;
  time: string;
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

export const getPanchangData = async (): Promise<PanchangData> => {
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

    console.log('Panchang API Request:', {
      url: `${BASE_URL}/panchang`,
      params: { 
        datetime: isoDateTime,
        lat: latitude,
        lng: longitude,
        timezone
      }
    });

    const response = await axios.get(`${BASE_URL}/panchang`, {
      params: { 
        datetime: isoDateTime,
        lat: latitude,
        lng: longitude,
        timezone
      }
    });

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

    const response = await axios.get(`${BASE_URL}/panchang/nearest-transits`, {
      params: { date }
    });

    console.log('Transit API Response:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Transit API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params
      });
    } else {
      console.error('Error fetching nearest transits:', error);
    }
    throw error;
  }
}; 