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

  if (!chartData.metadata) {
    throw new BirthChartError('Missing metadata', 'VALIDATION');
  }

  // Kiểm tra các trường bắt buộc trong metadata
  const requiredFields = ['date', 'time', 'latitude', 'longitude', 'timezone'];
  const missingFields = requiredFields.filter(field => !chartData.metadata[field]);
  
  if (missingFields.length > 0) {
    console.warn(`Missing metadata fields: ${missingFields.join(', ')}. Will use default values.`);
    // Không throw error, chỉ cảnh báo
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
  ascendant_full?: Json;
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

      console.log("Original ascendantFull before saving:", chartData.ascendantFull);

      // Bảng chuyển đổi từ tên sang số cung hoàng đạo
      const SIGN_NAME_TO_INDEX = {
        "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3,
        "Leo": 4, "Virgo": 5, "Libra": 6, "Scorpio": 7,
        "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11
      };

      // Đảm bảo dữ liệu được chuyển đổi đúng cách trước khi lưu
      // Tạo bản sao sâu của dữ liệu để tránh tham chiếu
      const planetsCopy = JSON.parse(JSON.stringify(chartData.planets)).map(planet => {
        // Đảm bảo sign luôn là số
        if (typeof planet.sign === 'string' && planet.sign in SIGN_NAME_TO_INDEX) {
          planet.sign = SIGN_NAME_TO_INDEX[planet.sign];
        }
        return planet;
      });

      const housesCopy = JSON.parse(JSON.stringify(chartData.houses)).map(house => {
        // Đảm bảo sign luôn là số
        if (typeof house.sign === 'string' && house.sign in SIGN_NAME_TO_INDEX) {
          house.sign = SIGN_NAME_TO_INDEX[house.sign];
        }
        return house;
      });

      const dashasCopy = JSON.parse(JSON.stringify(chartData.dashas));
      const ascendantNakshatra = JSON.parse(JSON.stringify(chartData.ascendantNakshatra));

      // Chuẩn bị dữ liệu ascendant_full
      const ascendantFullString = chartData.ascendantFull ? JSON.stringify(chartData.ascendantFull) : null;
      console.log("Stringified ascendant_full:", ascendantFullString);

      // Prepare chart data with safe JSON conversion
      const chartDataToSave = {
        user_id: userId,
        planets: planetsCopy,
        houses: housesCopy,
        nakshatras: {
          moonNakshatra: chartData.moonNakshatra,
          ascendantNakshatra: ascendantNakshatra
        },
        // Lưu ascendant vào metadata thay vì trường riêng
        metadata: {
          ...chartData.metadata,
          name: formData.name,
          location: formData.location,
          ascendant: chartData.ascendant,
          ascendant_full: ascendantFullString,
          lunarDay: chartData.lunarDay
        },
        dashas: dashasCopy,
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

      console.log("Reconstructing chart data from:", savedChart);

      // Parse JSON data if needed
      const planets = typeof savedChart.planets === 'string' ? JSON.parse(savedChart.planets) : savedChart.planets;
      const houses = typeof savedChart.houses === 'string' ? JSON.parse(savedChart.houses) : savedChart.houses;
      const nakshatras = typeof savedChart.nakshatras === 'string' ? JSON.parse(savedChart.nakshatras) : savedChart.nakshatras;
      const metadata = typeof savedChart.metadata === 'string' ? JSON.parse(savedChart.metadata) : savedChart.metadata;
      const dashas = typeof savedChart.dashas === 'string' ? JSON.parse(savedChart.dashas) : savedChart.dashas;
      
      // Xử lý ascendant_full
      console.log("Raw ascendant_full from database:", savedChart.ascendant_full);
      let ascendantFull = null;
      
      try {
        if (savedChart.ascendant_full) {
          if (typeof savedChart.ascendant_full === 'string') {
            ascendantFull = JSON.parse(savedChart.ascendant_full);
          } else {
            ascendantFull = savedChart.ascendant_full;
          }
        }
        console.log("Parsed ascendantFull:", ascendantFull);
      } catch (error) {
        console.error("Error parsing ascendant_full:", error);
      }

      console.log("Parsed data:", { planets, houses, nakshatras, metadata, dashas, ascendantFull });

      // Bảng chuyển đổi từ số sang tên cung hoàng đạo
      const SIGN_INDEX_TO_NAME = [
        "Aries", "Taurus", "Gemini", "Cancer", 
        "Leo", "Virgo", "Libra", "Scorpio", 
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
      ];

      // Bảng chuyển đổi từ tên sang số cung hoàng đạo
      const SIGN_NAME_TO_INDEX = {
        "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3,
        "Leo": 4, "Virgo": 5, "Libra": 6, "Scorpio": 7,
        "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11
      };

      // Đảm bảo các giá trị số được chuyển đổi đúng
      const parsedPlanets = Array.isArray(planets) ? planets.map(planet => {
        // Xử lý sign dù là số hay tên
        let signIndex = planet.sign;
        if (typeof planet.sign === 'string' && planet.sign in SIGN_NAME_TO_INDEX) {
          signIndex = SIGN_NAME_TO_INDEX[planet.sign];
        } else if (typeof planet.sign === 'number') {
          signIndex = planet.sign;
        }

        return {
          ...planet,
          longitude: Number(planet.longitude) || 0,
          latitude: Number(planet.latitude) || 0,
          longitudeSpeed: Number(planet.longitudeSpeed) || 0,
          sign: Number(signIndex) || 0,
          house: Number(planet.house) || 0,
          aspectingPlanets: planet.aspectingPlanets || [],
          aspects: Array.isArray(planet.aspects) ? planet.aspects.map((aspect: any) => ({
            ...aspect,
            orb: Number(aspect.orb) || 0
          })) : [],
          color: planet.color || '#000000',
          nakshatra: planet.nakshatra || {
            name: '',
            lord: '',
            startDegree: 0,
            endDegree: 0,
            pada: 1
          }
        };
      }) : [];

      const parsedHouses = Array.isArray(houses) ? houses.map(house => {
        // Xử lý sign dù là số hay tên
        let signIndex = house.sign;
        if (typeof house.sign === 'string' && house.sign in SIGN_NAME_TO_INDEX) {
          signIndex = SIGN_NAME_TO_INDEX[house.sign];
        } else if (typeof house.sign === 'number') {
          signIndex = house.sign;
        }

        return {
          ...house,
          number: Number(house.number) || 0,
          longitude: Number(house.longitude) || 0,
          sign: Number(signIndex) || 0,
          planets: Array.isArray(house.planets) ? house.planets : []
        };
      }) : [];

      // Ensure dashas structure is valid
      const parsedDashas = {
        current: dashas?.current ? {
          planet: dashas.current.planet || '',
          startDate: dashas.current.startDate || '',
          endDate: dashas.current.endDate || '',
          elapsed: dashas.current.elapsed || { years: 0, months: 0, days: 0 },
          remaining: dashas.current.remaining || { years: 0, months: 0, days: 0 },
          antardasha: dashas.current.antardasha || {
            current: undefined,
            sequence: []
          }
        } : {} as any,
        sequence: Array.isArray(dashas?.sequence) ? dashas.sequence : []
      };

      // Reconstruct the chart data
      const reconstructed: VedicChartData = {
        ascendant: Number(savedChart.ascendant) || 0,
        ascendantNakshatra: nakshatras?.ascendantNakshatra || {
          name: '',
          lord: '',
          startDegree: 0,
          endDegree: 0,
          pada: 1
        },
        // Khôi phục đối tượng ascendant đầy đủ nếu có
        ascendantFull: ascendantFull,
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
        dashas: parsedDashas
      };

      console.log("Reconstructed chart data:", reconstructed);
      return reconstructed;
    } catch (error) {
      console.error("Error reconstructing chart data:", error);
      throw error;
    }
  },

  reconstructFormData(savedChart: SavedChart, userEmail: string): BirthDataFormValues {
    try {
      if (!savedChart) {
        throw new BirthChartError('Invalid saved chart data', 'VALIDATION');
      }

      console.log("Reconstructing form data from:", savedChart);

      // Parse metadata if it's a string
      const metadata = typeof savedChart.metadata === 'string' 
        ? JSON.parse(savedChart.metadata) 
        : savedChart.metadata;

      if (!metadata) {
        throw new BirthChartError('Missing metadata in saved chart', 'VALIDATION');
      }

      console.log("Parsed metadata:", metadata);

      // Ensure all fields are properly extracted
      const formData: BirthDataFormValues = {
        name: metadata.name || '',
        email: userEmail || '',
        birthDate: metadata.date || '',
        birthTime: metadata.time || '',
        location: metadata.location || '',
        latitude: Number(metadata.latitude) || 0,
        longitude: Number(metadata.longitude) || 0,
        timezone: metadata.timezone || 'UTC'
      };

      console.log("Reconstructed form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error reconstructing form data:", error);
      throw error;
    }
  },

  async getChartById(chartId: string): Promise<VedicChartData | null> {
    try {
      const { data: chart, error } = await supabase
        .from('birth_charts')
        .select('*')
        .eq('id', chartId)
        .single();

      if (error) {
        console.error('Error fetching chart:', error);
        return null;
      }

      if (!chart) {
        console.error('Chart not found');
        return null;
      }

      console.log('Fetched chart data:', chart);

      // Reconstruct chart data using existing method
      return this.reconstructChartData(chart);
    } catch (error) {
      console.error('Error in getChartById:', error);
      return null;
    }
  }
}; 