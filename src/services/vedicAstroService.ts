
import { DateTime } from 'luxon';
import { VEDIC_ASTRO_API_CONFIG, VedicChartRequest, VedicChartResponse } from '@/utils/vedicAstrology/config';
import { VedicChartData } from '@/components/VedicAstrology/VedicChart';
import { generateVedicChart, SwissEphParams } from './swissephWasm';

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
    
    // Parse date and time
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
    
    // Since we can't use SwissEph in browser, use our demo chart generator
    console.log("Using demo chart generator for calculations");
    return generateVedicChart(params);
  } catch (error) {
    console.error("Error calculating chart:", error);
    throw error;
  }
}
