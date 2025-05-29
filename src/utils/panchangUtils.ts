import { format, parseISO } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { PanchangData, PlanetaryTransit, NearestTransits } from '../services/panchangService';

export interface FormattedPanchangData {
  date: string;
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

export interface FormattedTransits extends Omit<NearestTransits, 'events'> {
  events: (PlanetaryTransit & {
    formattedDate: string;
    formattedTime: string;
  })[];
}

export const formatTime = (timeString: string, language: 'vi' | 'en' = 'en'): string => {
  try {
    // Assuming timeString is in HH:mm:ss format, we need to create a full date
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    return format(today, 'HH:mm', {
      locale: language === 'vi' ? vi : enUS
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

export const formatTransits = (
  data: NearestTransits,
  language: 'vi' | 'en' = 'en'
): FormattedTransits => {
  return {
    referenceDate: format(parseISO(data.referenceDate), 'dd/MM/yyyy', {
      locale: language === 'vi' ? vi : enUS
    }),
    events: data.events.map(event => ({
      ...event,
      formattedDate: format(parseISO(event.date), 'dd/MM/yyyy', {
        locale: language === 'vi' ? vi : enUS
      }),
      formattedTime: formatTime(event.time, language)
    }))
  };
};

export const formatPanchangData = (
  data: PanchangData,
  language: 'vi' | 'en' = 'en'
): FormattedPanchangData => {
  return {
    date: format(parseISO(data.date), 'dd/MM/yyyy', {
      locale: language === 'vi' ? vi : enUS
    }),
    lunarInfo: {
      day: data.lunarDay,
      month: data.lunarMonth,
      year: data.lunarYear
    },
    solarEvents: {
      sunriseFormatted: formatTime(data.sunriseTime, language),
      sunsetFormatted: formatTime(data.sunsetTime, language),
      moonriseFormatted: formatTime(data.moonriseTime, language),
      moonsetFormatted: formatTime(data.moonsetTime, language)
    },
    astrologicalInfo: {
      tithi: data.tithi,
      nakshatra: data.nakshatra,
      yoga: data.yoga,
      karana: data.karana
    }
  };
}; 