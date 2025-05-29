import axios from 'axios';

export interface PanchangData {
  success: boolean;
  data: {
    date: string;
    lunarDay: {
      tithi: number;
      tithiName: string;
      tithiEnd: string;
    };
    lunarMonth: {
      name: string;
      isLeap: boolean;
    };
    solarEvents: {
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
    };
    specialEvents: {
      solarEclipse: {
        isEclipse: boolean;
        type: string;
        start: string;
        maximum: string;
        end: string;
      };
      lunarEclipse: {
        isEclipse: boolean;
        type: string;
        start: string;
        maximum: string;
        end: string;
      };
    };
    nakshatra: {
      id: number;
      name: string;
      endTime: string;
    };
    yoga: {
      id: number;
      name: string;
      endTime: string;
    };
    karana: {
      id: number;
      name: string;
      endTime: string;
    };
  };
}

const API_URL = 'https://vedicvn-api.onrender.com/api';

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
    // Get current time in HH:mm format
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });

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

    const response = await axios.get(`${API_URL}/panchang`, {
      params: { 
        date,
        time,
        latitude,
        longitude,
        timezone
      },
      headers: {
        'Accept-Language': document.documentElement.lang || 'en'
      }
    });

    console.log('API Request:', {
      url: `${API_URL}/panchang`,
      params: { date, time, latitude, longitude, timezone }
    });
    console.log('API Response:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('Error fetching Panchang data:', error);
    }
    throw error;
  }
}; 