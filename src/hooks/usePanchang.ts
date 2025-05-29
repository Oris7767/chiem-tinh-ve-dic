import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getPanchangData, PanchangData } from '../services/panchangService';
import { formatPanchangData, FormattedPanchangData } from '../utils/panchangUtils';
import { useLanguage } from '../context/LanguageContext';

export const usePanchang = () => {
  const { language } = useLanguage();
  const today = new Date().toISOString();

  const {
    data: rawData,
    isLoading,
    error,
    refetch
  } = useQuery<PanchangData>({
    queryKey: ['panchang', format(new Date(), 'yyyy-MM-dd')],
    queryFn: () => getPanchangData(today),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24 hours
  });

  const [formattedData, setFormattedData] = useState<FormattedPanchangData | null>(null);

  useEffect(() => {
    if (rawData) {
      const formatted = formatPanchangData(rawData, language as 'vi' | 'en');
      setFormattedData(formatted);
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