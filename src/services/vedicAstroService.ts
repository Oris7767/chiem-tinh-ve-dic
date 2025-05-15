
import { DateTime } from 'luxon';
import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse } from '@/utils/vedicAstrology/config';
import { VedicChartData } from '@/components/VedicAstrology/VedicChart';
import { calculateVedicChartWasm, generateFallbackChart, SwissEphParams } from './swissephWasm';

// Constants for zodiac signs
const SIGNS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

/**
 * Calculate Vedic chart based on birth information
 */
export async function calculateVedicChart(formData: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
}): Promise<VedicChartData> {
  try {
    // Prepare request object
    const request: VedicChartRequest = {
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      latitude: formData.latitude, 
      longitude: formData.longitude,
      timezone: formData.timezone
    };
    
    console.log("Calculating chart with data:", request);
    
    // Parse date and time for WebAssembly calculation
    const [year, month, day] = request.birthDate.split('-').map(Number);
    const [hour, minute] = request.birthTime.split(':').map(Number);
    
    const params: SwissEphParams = {
      year,
      month,
      day,
      hour,
      minute,
      latitude: request.latitude,
      longitude: request.longitude,
      timezone: request.timezone
    };
    
    // Try using WebAssembly for calculation
    try {
      console.log("Attempting to use WebAssembly for calculations");
      const wasmResult = await calculateVedicChartWasm(params);
      console.log("WebAssembly calculation successful:", wasmResult);
      return wasmResult;
    } catch (wasmError) {
      console.error("WebAssembly calculation failed, falling back:", wasmError);
      
      // If WebAssembly fails, check if we should use server API or fallback mode
      if (!VEDIC_ASTRO_API_CONFIG.FALLBACK_MODE) {
        console.log("Attempting to use server API for calculations");
        // Make a real API call to the server
        const response = await fetch(VEDIC_ASTRO_API_CONFIG.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        const data: VedicChartResponse = await response.json();
        return data;
      } else {
        // Use local fallback
        console.log("Using fallback mode for chart calculations");
        return generateFallbackChart(params);
      }
    }
  } catch (error) {
    console.error("Error calculating chart:", error);
    throw error;
  }
}
