
import { supabase } from '@/integrations/supabase/client';

export const initSupabaseResources = async () => {
  try {
    // Create necessary storage buckets
    await supabase.functions.invoke('create-bucket');
    console.log('Initialized Supabase resources');
  } catch (error) {
    console.error('Error initializing Supabase resources:', error);
  }
};
