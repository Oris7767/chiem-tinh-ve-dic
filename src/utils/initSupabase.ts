
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';

export const initSupabaseResources = async () => {
  try {
    // First, test the connection
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      console.error('Failed to connect to Supabase. Please check your credentials.');
      return;
    }
    
    console.log('Connection to Supabase successful. Initializing resources...');
    
    // Create necessary storage buckets with retries
    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;
    
    while (attempt < MAX_RETRIES && !success) {
      try {
        const response = await supabase.functions.invoke('create-bucket', {
          method: 'POST',
          body: { bucketName: 'blog-images' },
        });
        
        if (response.error) {
          throw new Error(`Failed to initialize Supabase resources: ${response.error.message}`);
        }
        
        success = true;
        console.log('Initialized Supabase resources:', response.data);
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt}/${MAX_RETRIES} failed:`, error);
        
        if (attempt < MAX_RETRIES) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    
    if (!success) {
      console.error('Failed to initialize Supabase resources after multiple attempts');
    }
  } catch (error) {
    console.error('Error initializing Supabase resources:', error);
  }
};
