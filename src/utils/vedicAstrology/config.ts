// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // User's custom API endpoint
  API_URL: "https://vedicvn-api.onrender.com/api/chart",
  FALLBACK_MODE: false, // Set to false to use the API
  API_TIMEOUT: 60000, // 60 seconds timeout for API calls
  GEOAPIFY_API_KEY: "522a159a787444c0bf969ad2a48c63ca", // Free API key for geolocation
  EMAIL_SERVICE: {
    USE_GMAIL: true, // Set to true to use Gmail instead of Supabase
    SENDER_EMAIL: "Votiveacademy@gmail.com", // Gmail address for sending emails
    APP_PASSWORD: "rbuw mnaj ikms qkwn" // Gmail app password for authentication
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

export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: string;
  nakshatra: string;
  house: number;
  retrograde: boolean;
}

export interface HousePosition {
  house: number;
  sign: string;
  degree: number;
}

export interface DashaDetail {
  planet: string;
  endDate: string; // ISO string
}

export interface Dasha {
  current: string;
  sequence: DashaDetail[];
}

export interface VedicChartResponse {
  ascendant: Ascendant;
  planets: PlanetaryPosition[];
  houses: HousePosition[];
  dashas: Dasha;
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
