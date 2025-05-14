
// Calculate Vedic Chart Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { GEOAPIFY_API_KEY } from "../_shared/constants.ts";

// Constants for planets and signs
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFA500" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#SILVER" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#00FF00" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FFFFFF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF0000" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFFF00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#000080" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#4B0082" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#800000" }
];

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
    
    // We'll use an alternative approach for Vedic calculations since swisseph doesn't work in Deno
    
    // Calculate Julian day (simplified formula)
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Add time component
    const timeInDays = (hour + minute / 60) / 24;
    const julday_ut = jd + timeInDays - 0.5;
    
    console.log("Julian day:", julday_ut);
    
    // For demo purposes, we'll generate somewhat realistic planetary positions
    // This is not astronomically accurate but provides a viable demo
    const seed = Number(new Date(`${birth_date}T${birth_time}`));
    
    // Generate planetary positions based on birth details
    const planetResults = PLANETS.map((planet, index) => {
      const baseAngle = (seed % 1000 + index * 30) % 360; // Pseudo-random base angle
      
      // Add some realistic variations based on planet
      let longitude = (baseAngle + (index * 40) % 360) % 360;
      
      // Special case for Ketu (always 180° from Rahu)
      if (planet.id === "ke") {
        const rahuPlanet = PLANETS.find(p => p.id === "ra");
        const rahuIndex = PLANETS.indexOf(rahuPlanet);
        const rahuLongitude = (baseAngle + (rahuIndex * 40) % 360) % 360;
        longitude = (rahuLongitude + 180) % 360;
      }
      
      const sign = Math.floor(longitude / 30);
      
      return {
        id: planet.id,
        name: planet.name,
        symbol: planet.symbol,
        longitude: longitude,
        sign: sign,
        retrograde: Math.random() > 0.8, // Random retrograde state
        color: planet.color
      };
    });
    
    // Calculate ascendant (simplified)
    // This is a rough approximation based on sidereal time
    const localSiderealTimeFactor = (longitude / 15 + (hour + minute / 60)) % 24;
    const ascendantLongitude = (localSiderealTimeFactor * 15 + 90) % 360;
    
    // Calculate houses
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseLongitude = (ascendantLongitude + i * 30) % 360;
      return {
        number: i + 1,
        longitude: houseLongitude,
        sign: Math.floor(houseLongitude / 30)
      };
    });
    
    // Assign houses to planets
    for (const planet of planetResults) {
      // Find house for each planet based on its position relative to the ascendant
      let houseIndex = 0;
      for (let i = 0; i < houses.length; i++) {
        const nextHouseIndex = (i + 1) % 12;
        const currentHouseLongitude = houses[i].longitude;
        const nextHouseLongitude = houses[nextHouseIndex].longitude;
        
        // Check if the planet is in this house
        if (nextHouseLongitude < currentHouseLongitude) {
          // House spans 0° Aries
          if ((planet.longitude >= currentHouseLongitude) || 
              (planet.longitude < nextHouseLongitude)) {
            houseIndex = i;
            break;
          }
        } else {
          // Regular case
          if ((planet.longitude >= currentHouseLongitude) && 
              (planet.longitude < nextHouseLongitude)) {
            houseIndex = i;
            break;
          }
        }
      }
      
      planet.house = houses[houseIndex].number;
    }
    
    // Calculate Moon Nakshatra
    const moon = planetResults.find(p => p.id === "mo");
    let moonNakshatra = "Unknown";
    if (moon) {
      const moonLongitude = moon.longitude;
      // 27 nakshatras in 360 degrees
      const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
      if (nakshatraIndex >= 0 && nakshatraIndex < NAKSHATRAS.length) {
        moonNakshatra = NAKSHATRAS[nakshatraIndex];
      }
    }
    
    // Calculate Lunar Day (Tithi)
    const sun = planetResults.find(p => p.id === "su");
    let lunarDay = 1;
    if (moon && sun) {
      const sunLongitude = sun.longitude;
      const moonLongitude = moon.longitude;
      lunarDay = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12) + 1;
    }
    
    // Create response object
    const chartData = {
      ascendant: ascendantLongitude,
      planets: planetResults,
      houses: houses,
      moonNakshatra: moonNakshatra,
      lunarDay: lunarDay
    };
    
    console.log("Chart calculation complete");
    
    return new Response(JSON.stringify(chartData), {
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
