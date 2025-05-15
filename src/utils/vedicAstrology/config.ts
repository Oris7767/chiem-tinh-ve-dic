
// Configuration for the VedAstro calculation service
export const VEDIC_ASTRO_API_CONFIG = {
  // Set to true since we're using a browser-compatible implementation
  BROWSER_ONLY_MODE: true,
  FALLBACK_MODE: true,
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
