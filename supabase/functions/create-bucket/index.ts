
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("Create bucket function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request for CORS");
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the Supabase URL and key from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    console.log("Supabase URL available:", !!supabaseUrl);
    console.log("Supabase Key available:", !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }

    // Create a Supabase client with the admin key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if the bucket already exists
    console.log("Listing existing buckets");
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw listError;
    }
    
    console.log("Existing buckets:", existingBuckets);
    
    // Get bucket name from request or use default
    let bucketName = 'blog-images';
    try {
      const requestData = await req.json();
      if (requestData && requestData.bucketName) {
        bucketName = requestData.bucketName;
      }
    } catch (e) {
      // If no JSON in request, use default bucket name
      console.log("Using default bucket name:", bucketName);
    }
    
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    console.log(`Bucket "${bucketName}" exists:`, bucketExists);
    
    if (!bucketExists) {
      // Create a new bucket
      console.log(`Creating bucket "${bucketName}"`);
      const { data, error } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
        
      if (error) {
        console.error("Error creating bucket:", error);
        throw error;
      }
      
      console.log('Created bucket:', data);
      return new Response(
        JSON.stringify({ success: true, message: `${bucketName} bucket created`, data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        }
      );
    } else {
      console.log(`Bucket "${bucketName}" already exists`);
      return new Response(
        JSON.stringify({ success: true, message: `${bucketName} bucket already exists` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error in create-bucket function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
})
