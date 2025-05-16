
// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // Correct path to the Netlify function
  API_URL: "https://vedicapi.netlify.app/.netlify/functions/calculate",
  FALLBACK_MODE: true, // Set to true in case the API call fails
};

// This is the structure expected by the Swiss Ephemeris server
export interface VedicChartRequest {
  birthDate: string;     // YYYY-MM-DD format
  birthTime: string;     // HH:MM format
  latitude: number;      // Decimal degrees
  longitude: number;     // Decimal degrees
  timezone: string;      // IANA timezone name
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
