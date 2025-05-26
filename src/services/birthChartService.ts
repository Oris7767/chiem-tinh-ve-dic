import { supabase } from '@/integrations/supabase/client';
import { VedicChartData, DashaPeriod } from '@/components/VedicAstrology/VedicChart';
import { BirthDataFormValues } from '@/components/VedicAstrology/BirthChartForm';
import { Json } from '@/integrations/supabase/types';

// Custom error class for birth chart operations
export class BirthChartError extends Error {
  constructor(
    message: string,
    public code: 'VALIDATION' | 'DATABASE' | 'UNKNOWN',
    public details?: any
  ) {
    super(message);
    this.name = 'BirthChartError';
  }
}

// Validation functions
const validateChartData = (chartData: VedicChartData) => {
  if (!chartData) {
    throw new BirthChartError('Chart data is required', 'VALIDATION');
  }

  if (!Array.isArray(chartData.planets) || chartData.planets.length === 0) {
    throw new BirthChartError('Invalid planets data', 'VALIDATION');
  }

  if (!Array.isArray(chartData.houses) || chartData.houses.length === 0) {
    throw new BirthChartError('Invalid houses data', 'VALIDATION');
  }

  if (!chartData.metadata || !chartData.metadata.date || !chartData.metadata.time) {
    throw new BirthChartError('Missing required metadata', 'VALIDATION');
  }
};

const validateFormData = (formData: BirthDataFormValues) => {
  if (!formData) {
    throw new BirthChartError('Form data is required', 'VALIDATION');
  }

  if (!formData.name?.trim()) {
    throw new BirthChartError('Name is required', 'VALIDATION');
  }

  if (!formData.birthDate || !formData.birthTime) {
    throw new BirthChartError('Birth date and time are required', 'VALIDATION');
  }

  // Validate coordinates
  if (typeof formData.latitude !== 'number' || typeof formData.longitude !== 'number') {
    throw new BirthChartError('Invalid coordinates', 'VALIDATION');
  }

  if (formData.latitude < -90 || formData.latitude > 90) {
    throw new BirthChartError('Invalid latitude value', 'VALIDATION');
  }

  if (formData.longitude < -180 || formData.longitude > 180) {
    throw new BirthChartError('Invalid longitude value', 'VALIDATION');
  }
};

export interface SavedChart {
  id: string;
  user_id: string;
  created_at: string;
  planets: Json;
  houses: Json;
  nakshatras: {
    moonNakshatra: string;
    ascendantNakshatra: {
      name: string;
      lord: string;
      startDegree: number;
      endDegree: number;
      pada: number;
    };
  };
  metadata: {
    name: string;
    date: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
    timezone: string;
    ayanamsa: number;
    houseSystem: string;
  };
  ascendant: number;
  lunarDay: number;
  dashas?: {
    current: Json;
    sequence: Json[];
  };
}

export const birthChartService = {
  async saveChart(userId: string, chartData: VedicChartData, formData: BirthDataFormValues) {
    try {
      // Validate inputs
      if (!userId?.trim()) {
        throw new BirthChartError('User ID is required', 'VALIDATION');
      }

      validateChartData(chartData);
      validateFormData(formData);

      // Safely convert data to JSON
      const safeJsonStringify = (data: any) => {
        try {
          return JSON.stringify(data);
        } catch (error) {
          console.error("Error stringifying data:", error);
          throw new BirthChartError(
            'Failed to convert data to JSON format',
            'VALIDATION',
            error
          );
        }
      };

      // Prepare chart data with safe JSON conversion
      const chartDataToSave = {
        user_id: userId,
        planets: safeJsonStringify(chartData.planets),
        houses: safeJsonStringify(chartData.houses),
        nakshatras: safeJsonStringify({
          moonNakshatra: chartData.moonNakshatra,
          ascendantNakshatra: chartData.ascendantNakshatra
        }),
        ascendant: chartData.ascendant,
        lunarDay: chartData.lunarDay,
        metadata: safeJsonStringify({
          ...chartData.metadata,
          name: formData.name,
          location: formData.location
        }),
        dashas: safeJsonStringify(chartData.dashas),
        created_at: new Date().toISOString()
      };

      console.log("Attempting to save chart data:", chartDataToSave);

      // Check for existing chart with retry mechanism
      let retries = 3;
      let existingCharts = null;
      let error = null;

      while (retries > 0) {
        const { data, error: queryError } = await supabase
          .from('birth_charts')
          .select('id')
          .eq('user_id', userId);

        if (!queryError) {
          existingCharts = data;
          break;
        }

        error = queryError;
        retries--;
        if (retries > 0) {
          console.log(`Retrying query... ${retries} attempts remaining`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (error) {
        console.error("Failed to check for existing charts:", error);
        throw new BirthChartError(
          'Failed to check for existing charts',
          'DATABASE',
          error
        );
      }

      let result;
      if (existingCharts && existingCharts.length > 0) {
        // Update existing chart
        console.log("Updating existing chart for user:", userId);
        result = await supabase
          .from('birth_charts')
          .update(chartDataToSave)
          .eq('user_id', userId);
      } else {
        // Insert new chart
        console.log("Inserting new chart for user:", userId);
        result = await supabase
          .from('birth_charts')
          .insert([chartDataToSave]);
      }

      if (result.error) {
        console.error("Database operation failed:", result.error);
        throw new BirthChartError(
          'Failed to save chart to database',
          'DATABASE',
          result.error
        );
      }

      console.log("Chart saved successfully");
      return { success: true };
    } catch (error) {
      console.error("Error in saveChart:", error);
      
      if (error instanceof BirthChartError) {
        return { error };
      }

      return {
        error: new BirthChartError(
          'An unexpected error occurred while saving the chart',
          'UNKNOWN',
          error
        )
      };
    }
  },

  async getUserCharts(userId: string) {
    try {
      if (!userId?.trim()) {
        throw new BirthChartError('User ID is required', 'VALIDATION');
      }

      // Implement retry mechanism
      let retries = 3;
      let charts = null;
      let error = null;

      while (retries > 0) {
        const { data, error: queryError } = await supabase
          .from('birth_charts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!queryError) {
          charts = data;
          break;
        }

        error = queryError;
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (error) {
        throw new BirthChartError(
          'Failed to fetch user charts',
          'DATABASE',
          error
        );
      }

      return { charts: charts as SavedChart[] | null };
    } catch (error) {
      console.error("Error in getUserCharts:", error);
      
      if (error instanceof BirthChartError) {
        return { error };
      }

      return {
        error: new BirthChartError(
          'An unexpected error occurred',
          'UNKNOWN',
          error
        )
      };
    }
  },

  reconstructChartData(savedChart: SavedChart): VedicChartData {
    try {
      if (!savedChart) {
        throw new BirthChartError('Saved chart data is required', 'VALIDATION');
      }

      // Validate required fields
      if (!savedChart.planets || !savedChart.houses) {
        throw new BirthChartError('Invalid chart data structure', 'VALIDATION');
      }

      // Parse JSON data if needed
      const planets = typeof savedChart.planets === 'string' ? JSON.parse(savedChart.planets) : savedChart.planets;
      const houses = typeof savedChart.houses === 'string' ? JSON.parse(savedChart.houses) : savedChart.houses;
      const nakshatras = typeof savedChart.nakshatras === 'string' ? JSON.parse(savedChart.nakshatras) : savedChart.nakshatras;
      const metadata = typeof savedChart.metadata === 'string' ? JSON.parse(savedChart.metadata) : savedChart.metadata;
      const dashas = typeof savedChart.dashas === 'string' ? JSON.parse(savedChart.dashas) : savedChart.dashas;

      // Ensure numerical values are properly converted
      const parsedPlanets = (planets as any[]).map(planet => ({
        ...planet,
        longitude: Number(planet.longitude) || 0,
        latitude: Number(planet.latitude) || 0,
        longitudeSpeed: Number(planet.longitudeSpeed) || 0,
        sign: Number(planet.sign) || 0,
        house: Number(planet.house) || 0,
        aspectingPlanets: planet.aspectingPlanets || [],
        aspects: (planet.aspects || []).map((aspect: any) => ({
          ...aspect,
          orb: Number(aspect.orb) || 0
        })),
        color: planet.color || '#000000'
      }));

      const parsedHouses = (houses as any[]).map(house => ({
        ...house,
        number: Number(house.number) || 0,
        longitude: Number(house.longitude) || 0,
        sign: Number(house.sign) || 0,
        planets: house.planets || []
      }));

      return {
        ascendant: Number(savedChart.ascendant) || 0,
        ascendantNakshatra: nakshatras?.ascendantNakshatra || {
          name: '',
          lord: '',
          startDegree: 0,
          endDegree: 0,
          pada: 1
        },
        planets: parsedPlanets,
        houses: parsedHouses,
        moonNakshatra: nakshatras?.moonNakshatra || '',
        lunarDay: Number(savedChart.lunarDay) || 1,
        metadata: {
          ayanamsa: Number(metadata?.ayanamsa) || 24,
          date: metadata?.date || '',
          time: metadata?.time || '',
          latitude: Number(metadata?.latitude) || 0,
          longitude: Number(metadata?.longitude) || 0,
          timezone: metadata?.timezone || 'UTC',
          houseSystem: metadata?.houseSystem || 'W'
        },
        dashas: dashas ? {
          current: dashas.current as unknown as DashaPeriod,
          sequence: dashas.sequence as unknown as DashaPeriod[]
        } : {
          current: {} as DashaPeriod,
          sequence: []
        }
      };
    } catch (error) {
      console.error("Error reconstructing chart data:", error);
      throw error;
    }
  },

  reconstructFormData(savedChart: SavedChart, userEmail: string): BirthDataFormValues {
    try {
      if (!savedChart?.metadata) {
        throw new BirthChartError('Invalid saved chart data', 'VALIDATION');
      }

      return {
        name: savedChart.metadata?.name || '',
        email: userEmail || '',
        birthDate: savedChart.metadata?.date || '',
        birthTime: savedChart.metadata?.time || '',
        location: savedChart.metadata?.location || '',
        latitude: savedChart.metadata?.latitude || 0,
        longitude: savedChart.metadata?.longitude || 0,
        timezone: savedChart.metadata?.timezone || 'UTC'
      };
    } catch (error) {
      console.error("Error reconstructing form data:", error);
      throw error;
    }
  }
}; 