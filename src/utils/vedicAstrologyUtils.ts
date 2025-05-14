import { DateTime } from 'luxon';
import { PLANETS, NAKSHATRAS, PLANET_COLORS } from './constants';

// Type for chart calculation parameters
export interface ChartParams {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// This utility file now serves as a client-side wrapper for the Edge Function
// All real calculations are performed server-side using Swiss Ephemeris

// Function that calls the Edge Function via Supabase client
export const calculateVedicChart = async (params: ChartParams) => {
  try {
    console.log("Calling edge function with params:", params);
    
    // This is now just a placeholder - actual calculation happens in the Edge Function
    // The Supabase client call is implemented in the VedicChart component
    
    throw new Error("This utility is no longer used. Chart calculations are now performed server-side.");
  } catch (error) {
    console.error("Error in calculateVedicChart:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error calculating chart");
  }
};
