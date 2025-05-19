
// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // User's custom API endpoint
  API_URL: "https://vedicvn-api.onrender.com/api/fullchart",
  FALLBACK_MODE: false, // Set to false to use the API
  API_TIMEOUT: 60000, // 60 seconds timeout for API calls
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

// Cập nhật interface để khớp với định dạng JSON từ API
export interface VedicChartResponse {
  ascendant: {
    sign: string;
    degree: number;
    nakshatra: string;
  };
  planets: Array<any>; // Mảng rỗng từ API hiện tại
  houses: Array<{
    house: number;
    sign: string;
    degree: number;
  }>;
  dashas: {
    current: string;
    sequence: Array<{
      planet: string;
      endDate: string;
    }>;
  };
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
