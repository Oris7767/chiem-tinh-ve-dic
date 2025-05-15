
// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // Replace this with your actual Swiss Ephemeris server URL when you have it
  API_URL: "https://your-swiss-ephemeris-server.com/api/calculate",
  FALLBACK_MODE: true, // Set to true to use fallback when both WebAssembly and API fail
  EPHEMERIS_PATH: "/ephe", // Path to ephemeris files (relative to public directory)
};

// This is the structure expected by the Swiss Ephemeris server
export interface VedicChartRequest {
  birthDate: string;     // YYYY-MM-DD format
  birthTime: string;     // HH:MM format
  latitude: number;      // Decimal degrees
  longitude: number;     // Decimal degrees
  timezone: string;      // IANA timezone name
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
