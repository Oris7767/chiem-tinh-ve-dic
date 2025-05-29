import { format } from 'date-fns';
import { PanchangData, PlanetaryTransit, NearestTransits } from '../services/panchangService';

export interface FormattedPanchangData {
  lunarInfo: {
    day: number;
    month: number;
    year: number;
  };
  solarEvents: {
    sunriseFormatted: string;
    sunsetFormatted: string;
    moonriseFormatted: string;
    moonsetFormatted: string;
  };
  astrologicalInfo: {
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
}

export interface FormattedTransit {
  planet: string;
  fromSign?: string;
  toSign?: string;
  formattedDate: string;
  formattedTime: string;
  type: string;
}

export const formatPanchangData = (data: PanchangData, language: 'vi' | 'en'): FormattedPanchangData => {
  return {
    lunarInfo: {
      day: data.lunarDay,
      month: data.lunarMonth,
      year: data.lunarYear,
    },
    solarEvents: {
      sunriseFormatted: formatTime(data.sunriseTime, language),
      sunsetFormatted: formatTime(data.sunsetTime, language),
      moonriseFormatted: formatTime(data.moonriseTime, language),
      moonsetFormatted: formatTime(data.moonsetTime, language),
    },
    astrologicalInfo: {
      tithi: data.tithi,
      nakshatra: data.nakshatra,
      yoga: data.yoga,
      karana: data.karana,
    },
  };
};

export const formatTransits = (data: NearestTransits, language: 'vi' | 'en'): FormattedTransit[] => {
  return data.events.map((transit: PlanetaryTransit) => {
    const base = {
      planet: transit.planet,
      formattedDate: formatDate(transit.timestamp, language),
      formattedTime: formatTime(transit.timestamp, language),
      type: transit.type
    };

    if (transit.type === 'INGRESS' && transit.details.fromSign && transit.details.toSign) {
      return {
        ...base,
        fromSign: transit.details.fromSign,
        toSign: transit.details.toSign,
      };
    }

    return base;
  });
};

const formatTime = (timeString: string, language: 'vi' | 'en'): string => {
  try {
    const date = new Date(timeString);
    return format(date, language === 'vi' ? 'HH:mm' : 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

const formatDate = (dateString: string, language: 'vi' | 'en'): string => {
  try {
    const date = new Date(dateString);
    return format(date, language === 'vi' ? 'dd/MM/yyyy' : 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}; 