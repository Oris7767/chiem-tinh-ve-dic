
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get the Supabase URL and key from environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  // Create a Supabase client with the admin key
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if the bucket already exists
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const bucketName = 'blog-images';
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create a new bucket
      const { data, error } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
        });
        
      if (error) {
        throw error;
      }
      
      console.log('Created blog images bucket:', data);
      return new Response(
        JSON.stringify({ success: true, message: 'Blog images bucket created' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: true, message: 'Blog images bucket already exists' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error creating bucket:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
})
