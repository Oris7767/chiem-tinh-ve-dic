
import { supabase } from '@/integrations/supabase/client';

export const initSupabaseResources = async () => {
  try {
    // Create necessary storage buckets
    const response = await supabase.functions.invoke('create-bucket', {
      method: 'POST',
    });
    
    if (response.error) {
      throw new Error(`Failed to initialize Supabase resources: ${response.error.message}`);
    }
    
    console.log('Initialized Supabase resources:', response.data);
  } catch (error) {
    console.error('Error initializing Supabase resources:', error);
  }
};
