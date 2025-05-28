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

export const getPanchangData = async (date: string): Promise<PanchangData> => {
  try {
    const response = await axios.get(`${API_URL}/panchang`, {
      params: { 
        date,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Get user's timezone
      },
      headers: {
        'Accept-Language': document.documentElement.lang || 'en'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Panchang data:', error);
    throw error;
  }
}; 