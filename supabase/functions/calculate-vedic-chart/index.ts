
// Calculate Vedic Chart Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Import and use SwissEph in Deno Edge Function
import swisseph from "npm:swisseph";

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
    
    // Set path to ephemeris data
    swisseph.swe_set_ephe_path("./ephe");
    
    // Parse date and time
    const [year, month, day] = birth_date.split('-').map(Number);
    const [hour, minute] = birth_time.split(':').map(Number);
    const date = { year, month, day, hour, minute };
    
    console.log("Parsed date:", date);
    
    // Calculate Julian day
    let julday_ut = swisseph.swe_julday(
      date.year, 
      date.month, 
      date.day, 
      date.hour + date.minute / 60, 
      swisseph.SE_GREG_CAL
    );
    
    console.log("Julian day:", julday_ut);
    
    // Define planets to calculate
    const planets = [
      { id: "su", name: "Sun", planet: swisseph.SE_SUN, color: "#FFA500" },
      { id: "mo", name: "Moon", planet: swisseph.SE_MOON, color: "#SILVER" },
      { id: "me", name: "Mercury", planet: swisseph.SE_MERCURY, color: "#00FF00" },
      { id: "ve", name: "Venus", planet: swisseph.SE_VENUS, color: "#FFFFFF" },
      { id: "ma", name: "Mars", planet: swisseph.SE_MARS, color: "#FF0000" },
      { id: "ju", name: "Jupiter", planet: swisseph.SE_JUPITER, color: "#FFFF00" },
      { id: "sa", name: "Saturn", planet: swisseph.SE_SATURN, color: "#000080" },
      { id: "ra", name: "Rahu", planet: swisseph.SE_MEAN_NODE, color: "#4B0082" }, // Rahu (North Node)
      // Ketu (South Node) is calculated as Rahu + 180 degrees
    ];
    
    // Calculate planet positions
    const planetResults = [];
    const flag = swisseph.SEFLG_SPEED;
    
    for (const planet of planets) {
      try {
        const result = swisseph.swe_calc_ut(julday_ut, planet.planet, flag);
        
        if (result.error) {
          console.error(`Error calculating ${planet.id}:`, result.error);
        } else {
          const longitude = result.longitude;
          const sign = Math.floor(longitude / 30);
          const house = Math.floor(((longitude / 30) + 10) % 12) + 1; // Simple house system
          
          const symbol = planet.id === "su" ? "☉" : 
                        planet.id === "mo" ? "☽" : 
                        planet.id === "me" ? "☿" : 
                        planet.id === "ve" ? "♀" : 
                        planet.id === "ma" ? "♂" : 
                        planet.id === "ju" ? "♃" : 
                        planet.id === "sa" ? "♄" : 
                        planet.id === "ra" ? "☊" : "?";
          
          planetResults.push({
            id: planet.id,
            name: planet.name,
            symbol: symbol,
            longitude: longitude,
            house: house,
            sign: sign,
            retrograde: result.retrograde || (result.speed && result.speed < 0),
            color: planet.color
          });
        }
      } catch (err) {
        console.error(`Error calculating ${planet.id}:`, err);
      }
    }
    
    // Add Ketu (South Node) - 180 degrees from Rahu
    const rahu = planetResults.find(p => p.id === "ra");
    if (rahu) {
      const ketuLongitude = (rahu.longitude + 180) % 360;
      const ketuSign = Math.floor(ketuLongitude / 30);
      const ketuHouse = Math.floor(((ketuLongitude / 30) + 10) % 12) + 1;
      
      planetResults.push({
        id: "ke",
        name: "Ketu",
        symbol: "☋",
        longitude: ketuLongitude,
        house: ketuHouse,
        sign: ketuSign,
        retrograde: false,
        color: "#800000" // Maroon color for Ketu
      });
    }
    
    // Calculate ascendant (lagna)
    const ascendant = swisseph.swe_houses(
      julday_ut,
      latitude,
      longitude,
      'P' // Placidus house system
    );
    
    // Calculate houses
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseLongitude = ascendant.cusps[i + 1];
      return {
        number: i + 1,
        longitude: houseLongitude,
        sign: Math.floor(houseLongitude / 30)
      };
    });
    
    // Calculate Moon Nakshatra
    const moon = planetResults.find(p => p.id === "mo");
    let moonNakshatra = "Unknown";
    if (moon) {
      const moonLongitude = moon.longitude;
      // 27 nakshatras in 360 degrees
      const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
      const nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
        "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
        "Uttara Bhadrapada", "Revati"
      ];
      moonNakshatra = nakshatras[nakshatraIndex];
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
      ascendant: ascendant.ascendant,
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
