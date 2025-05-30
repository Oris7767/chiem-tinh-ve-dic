// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // Base API URL
  BASE_URL: import.meta.env.VITE_VEDIC_API_URL || "https://vedicvn-api.onrender.com/api",
  // Endpoints
  CHART_ENDPOINT: "/chart",
  PANCHANG_ENDPOINT: "/panchang",
  TRANSITS_ENDPOINT: "/panchang/nearest-transits",
  // Other configs
  FALLBACK_MODE: false, // Set to false to use the API
  API_TIMEOUT: 180000, // 3 minutes timeout for API calls
  MAX_RETRIES: 3, // Maximum number of retry attempts
  RETRY_DELAY: 5000, // 5 seconds delay between retries
  GEOAPIFY_API_KEY: import.meta.env.VITE_GEOAPIFY_API_KEY, // Geoapify API key from environment variables
  EMAIL_SERVICE: {
    USE_GMAIL: true, // Set to true to use Gmail instead of Supabase
    SENDER_EMAIL: import.meta.env.VITE_GMAIL_SENDER_EMAIL, // Gmail address from environment variables
    APP_PASSWORD: import.meta.env.VITE_GMAIL_APP_PASSWORD // Gmail app password from environment variables
  }
};

// Request payload sent to the Swiss Ephemeris API
export interface VedicChartRequest {
  date: string;          // YYYY-MM-DD format for the API
  time: string;          // HH:MM format for the API
  latitude: number;      // Decimal degrees
  longitude: number;     // Decimal degrees
  timezone: string;      // IANA timezone name
  // Optional user details
  birthDate?: string;    // YYYY-MM-DD (if needed)
  birthTime?: string;    // HH:MM (if needed)
  location?: string;
  name?: string;
  email?: string;
}

// Response structure from the Swiss Ephemeris API
export interface Ascendant {
  sign: string;
  degree: number;
  nakshatra: string;
}

export interface Aspect {
  planet: string;
  aspect: string;
  orb: number;
}

export interface NakshatraInfo {
  name: string;
  lord: string;
  startDegree: number;
  endDegree: number;
  pada: number;
}

export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  latitude: number;
  longitudeSpeed: number;
  isRetrograde: boolean;
  sign: {
    name: string;
    longitude: number;
  };
  house: {
    number: number;
    sign: string;
  };
  nakshatra: NakshatraInfo;
  aspectingPlanets: string[];
  aspects: Aspect[];
}

export interface HousePosition {
  number: number;
  sign: string;
  degree: number;
  planets: string[];
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed?: {
    years: number;
    months: number;
    days: number;
  };
  remaining?: {
    years: number;
    months: number;
    days: number;
  };
  antardasha?: {
    current?: {
      planet: string;
      startDate: string;
      endDate: string;
      elapsed: {
        years: number;
        months: number;
        days: number;
      };
      remaining: {
        years: number;
        months: number;
        days: number;
      };
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
}

export interface Dasha {
  current: DashaPeriod;
  sequence: DashaPeriod[];
} 

export interface ChartMetadata {
  ayanamsa: number;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: string;
}

export interface VedicChartResponse {
  ascendant: {
    longitude: number;
    sign: {
      name: string;
      degree: number;
    };
    nakshatra: NakshatraInfo;
  };
  planets: PlanetaryPosition[];
  houses: HousePosition[];
  dashas: Dasha;
  metadata: ChartMetadata;
}

// Geoapify API response interface
export interface GeoapifyLocationResponse {
  type: string;
  features: Array<{
    type: string;
    properties: {
      datasource: {
        sourcename: string;
        attribution: string;
        license: string;
        url: string;
      };
      country: string;
      country_code: string;
      city?: string;
      formatted: string;
      lat: number;
      lon: number;
      timezone?: {
        name: string;
        offset_STD: string;
        offset_STD_seconds: number;
        offset_DST: string;
        offset_DST_seconds: number;
      };
    };
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    bbox?: [number, number, number, number];
  }>;
  query?: {
    text: string;
    parsed: {
      city?: string;
      expected_type: string;
    };
  };
}

