import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getNearestTransits } from '../services/panchangService';
import { formatTransits, FormattedTransit } from '../utils/panchangUtils';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

export const useTransits = () => {
  const { language } = useLanguage();
  const today = format(new Date(), 'yyyy-MM-dd');

  const {
    data: rawData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transits', today],
    queryFn: async () => {
      try {
        console.log('Fetching transit data...');
        const data = await getNearestTransits(today);
        console.log('Transit data received:', data);
        return data;
      } catch (err) {
        console.error('Error fetching transit data:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  let formattedData = null;
  if (rawData) {
    try {
      console.log('Formatting transit data...');
      formattedData = formatTransits(rawData, language);
      console.log('Formatted transit data:', formattedData);
    } catch (err) {
      console.error('Error formatting transit data:', err);
    }
  }

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