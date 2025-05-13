
// Calculate Vedic Chart Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Main function to handle requests
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { birth_date, birth_time, latitude, longitude, timezone } = await req.json();
    
    // Log received data for debugging
    console.log("Calculating chart with parameters:", { 
      birth_date, birth_time, latitude, longitude, timezone 
    });
    
    // Return a mock response for now until Swiss Ephemeris is implemented
    // This will be replaced with actual calculations
    const mockResponse = {
      ascendant: 0,
      planets: [
        { id: "su", name: "Sun", longitude: 120.5, house: 4, sign: 4, retrograde: false },
        { id: "mo", name: "Moon", longitude: 75.2, house: 3, sign: 2, retrograde: false },
        { id: "me", name: "Mercury", longitude: 110.8, house: 4, sign: 3, retrograde: true },
        { id: "ve", name: "Venus", longitude: 145.3, house: 5, sign: 4, retrograde: false },
        { id: "ma", name: "Mars", longitude: 210.7, house: 7, sign: 7, retrograde: false },
        { id: "ju", name: "Jupiter", longitude: 320.1, house: 11, sign: 10, retrograde: false },
        { id: "sa", name: "Saturn", longitude: 280.6, house: 10, sign: 9, retrograde: true },
        { id: "ra", name: "Rahu", longitude: 45.8, house: 2, sign: 1, retrograde: false },
        { id: "ke", name: "Ketu", longitude: 225.8, house: 8, sign: 7, retrograde: false }
      ],
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        longitude: (i * 30) % 360,
        sign: i % 12
      })),
      moonNakshatra: "Rohini"
    };
    
    return new Response(JSON.stringify(mockResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error calculating chart:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
