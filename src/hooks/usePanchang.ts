import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getPanchangData, PanchangData } from '../services/panchangService';
import { formatPanchangData, FormattedPanchangData } from '../utils/panchangUtils';
import { useLanguage } from '../context/LanguageContext';

export const usePanchang = () => {
  const { language } = useLanguage();
  const today = format(new Date(), 'yyyy-MM-dd');

  const {
    data: rawData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['panchang', today],
    queryFn: async () => {
      try {
        console.log('Fetching panchang data...');
        const data = await getPanchangData();
        console.log('Panchang data received:', data);
        return data;
      } catch (err) {
        console.error('Error fetching panchang data:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24 hours
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const [formattedData, setFormattedData] = useState<FormattedPanchangData | null>(null);

  useEffect(() => {
    if (rawData) {
      try {
        console.log('Formatting panchang data...');
        const formatted = formatPanchangData(rawData, language);
        console.log('Formatted panchang data:', formatted);
        setFormattedData(formatted);
      } catch (err) {
        console.error('Error formatting panchang data:', err);
      }
    }
  }, [rawData, language]);

  // Set up daily update at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      refetch();
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [refetch]);

  return {
    data: formattedData,
    isLoading,
    error,
    refetch
  };
}; 