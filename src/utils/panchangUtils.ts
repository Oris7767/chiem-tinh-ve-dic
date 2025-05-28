import { format, parseISO } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { PanchangData } from '../services/panchangService';

export interface FormattedPanchangData {
  lunarDay: {
    tithi: number;
    tithiName: string;
    tithiEndFormatted: string;
  };
  lunarMonth: {
    name: string;
    isLeap: boolean;
  };
  solarEvents: {
    sunriseFormatted: string;
    sunsetFormatted: string;
    moonriseFormatted: string;
    moonsetFormatted: string;
  };
  specialEvents: {
    solarEclipse: {
      isEclipse: boolean;
      type: string;
      timings: {
        startFormatted: string;
        maximumFormatted: string;
        endFormatted: string;
      };
    };
    lunarEclipse: {
      isEclipse: boolean;
      type: string;
      timings: {
        startFormatted: string;
        maximumFormatted: string;
        endFormatted: string;
      };
    };
  };
  nakshatra: {
    id: number;
    name: string;
    endTimeFormatted: string;
  };
  yoga: {
    id: number;
    name: string;
    endTimeFormatted: string;
  };
  karana: {
    id: number;
    name: string;
    endTimeFormatted: string;
  };
}

export const formatTime = (timeString: string, language: 'vi' | 'en' = 'en'): string => {
  try {
    const date = parseISO(timeString);
    return format(date, 'HH:mm', {
      locale: language === 'vi' ? vi : enUS
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

export const formatPanchangData = (
  data: PanchangData['data'],
  language: 'vi' | 'en' = 'en'
): FormattedPanchangData => {
  return {
    lunarDay: {
      tithi: data.lunarDay.tithi,
      tithiName: data.lunarDay.tithiName,
      tithiEndFormatted: formatTime(data.lunarDay.tithiEnd, language),
    },
    lunarMonth: {
      name: data.lunarMonth.name,
      isLeap: data.lunarMonth.isLeap,
    },
    solarEvents: {
      sunriseFormatted: formatTime(data.solarEvents.sunrise, language),
      sunsetFormatted: formatTime(data.solarEvents.sunset, language),
      moonriseFormatted: formatTime(data.solarEvents.moonrise, language),
      moonsetFormatted: formatTime(data.solarEvents.moonset, language),
    },
    specialEvents: {
      solarEclipse: {
        isEclipse: data.specialEvents.solarEclipse.isEclipse,
        type: data.specialEvents.solarEclipse.type,
        timings: {
          startFormatted: formatTime(data.specialEvents.solarEclipse.start, language),
          maximumFormatted: formatTime(data.specialEvents.solarEclipse.maximum, language),
          endFormatted: formatTime(data.specialEvents.solarEclipse.end, language),
        },
      },
      lunarEclipse: {
        isEclipse: data.specialEvents.lunarEclipse.isEclipse,
        type: data.specialEvents.lunarEclipse.type,
        timings: {
          startFormatted: formatTime(data.specialEvents.lunarEclipse.start, language),
          maximumFormatted: formatTime(data.specialEvents.lunarEclipse.maximum, language),
          endFormatted: formatTime(data.specialEvents.lunarEclipse.end, language),
        },
      },
    },
    nakshatra: {
      id: data.nakshatra.id,
      name: data.nakshatra.name,
      endTimeFormatted: formatTime(data.nakshatra.endTime, language),
    },
    yoga: {
      id: data.yoga.id,
      name: data.yoga.name,
      endTimeFormatted: formatTime(data.yoga.endTime, language),
    },
    karana: {
      id: data.karana.id,
      name: data.karana.name,
      endTimeFormatted: formatTime(data.karana.endTime, language),
    },
  };
}; 