
// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // User's custom API endpoint
  API_URL: "https://vedicvn-api.onrender.com",
  FALLBACK_MODE: false, // Set to false to use the API
  GEOAPIFY_API_KEY: "5c8b31ca4a494758b0f3b5bd7341db2d", // Free API key for geolocation
  EMAIL_SERVICE: {
    USE_GMAIL: true, // Set to true to use Gmail instead of Supabase
    SENDER_EMAIL: "Votiveacademy@gmail.com", // Gmail address for sending emails
    APP_PASSWORD: "rbuw mnaj ikms qkwn" // Gmail app password for authentication
  }
};

// This is the structure expected by the Swiss Ephemeris server
export interface VedicChartRequest {
  birthDate?: string;     // YYYY-MM-DD format
  birthTime?: string;     // HH:MM format
  date: string;          // YYYY-MM-DD format for the API
  time: string;          // HH:MM format for the API
  latitude: number;      // Decimal degrees
  longitude: number;     // Decimal degrees
  timezone: string;      // IANA timezone name
  location?: string;     // Location name (city, country)
  name?: string;         // Optional name field
  email?: string;        // Optional email field
}

// This matches the expected response format from the server
export interface VedicChartResponse {
  ascendant: number;
  planets: Array<{
    id: string;
    name: string;
    symbol: string;
    longitude: number;
    sign: number;
    house: number;
    retrograde: boolean;
    color: string;
  }>;
  houses: Array<{
    number: number;
    longitude: number;
    sign: number;
  }>;
  moonNakshatra: string;
  lunarDay: number;
}

// Geoapify API response interface
export interface GeoapifyLocationResponse {
  results?: Array<{
    properties: {
      formatted: string;
      lat: number;
      lon: number;
      timezone?: {
        name: string;
      }
    }
  }>;
  error?: string;
}
