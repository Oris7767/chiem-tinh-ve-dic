
// Calculate Vedic Chart Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Define constants for calculations
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

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
    
    // Parse date and time
    const [year, month, day] = birth_date.split('-').map(Number);
    const [hour, minute] = birth_time.split(':').map(Number);
    
    // Generate mock data for planets and houses since we can't use swisseph in edge function
    const mockData = generateMockChartData(year, month, day, hour, minute, latitude, longitude);
    
    console.log("Chart calculation complete");
    
    return new Response(JSON.stringify(mockData), {
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

// Mock function to generate chart data
function generateMockChartData(year: number, month: number, day: number, 
  hour: number, minute: number, latitude: number, longitude: number) {
  
  // Create a seed based on birth data for consistent pseudo-random generation
  const seed = year + month * 100 + day + hour + minute + Math.floor(latitude) + Math.floor(longitude);
  
  // Generate planets
  const planetNames = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"];
  const planetIds = ["su", "mo", "me", "ve", "ma", "ju", "sa", "ra", "ke"];
  const planetSymbols = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "☊", "☋"]; 
  const planetColors = [
    "#FFA500",      // Orange - Sun
    "#SILVER",      // Silver - Moon
    "#00FF00",      // Green - Mercury
    "#FFFFFF",      // White - Venus
    "#FF0000",      // Red - Mars
    "#FFFF00",      // Yellow - Jupiter
    "#000080",      // Navy Blue - Saturn
    "#4B0082",      // Indigo - Rahu
    "#800000",      // Maroon - Ketu
  ];
  
  const planets = planetNames.map((name, index) => {
    // Generate pseudo-random values based on birth data
    const idValue = (seed + index * 37) % 9;
    const longitude = ((seed + index * 17) % 360);
    const sign = Math.floor(longitude / 30);
    const house = ((sign + Math.floor(seed % 12)) % 12) + 1;
    const retrograde = ((seed + index * 23) % 10) > 7;
    
    return {
      id: planetIds[index],
      name,
      symbol: planetSymbols[index],
      longitude,
      house,
      sign,
      retrograde,
      color: planetColors[index]
    };
  });
  
  // Generate houses
  const ascendant = (seed % 360);
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseLongitude = (ascendant + i * 30) % 360;
    return {
      number: i + 1,
      longitude: houseLongitude,
      sign: Math.floor(houseLongitude / 30)
    };
  });
  
  // Calculate Moon Nakshatra (27 nakshatras in 360 degrees)
  const moonLongitude = planets.find(p => p.id === "mo")?.longitude || 0;
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
  const moonNakshatra = NAKSHATRAS[nakshatraIndex % 27];
  
  // Calculate Lunar Day (Tithi) - simplified mock calculation
  const sunLongitude = planets.find(p => p.id === "su")?.longitude || 0;
  const lunarDay = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
  
  return {
    ascendant,
    planets,
    houses,
    moonNakshatra,
    lunarDay
  };
}
