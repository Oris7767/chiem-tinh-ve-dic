
const swisseph = require('swisseph');
const { DateTime } = require('luxon');
const path = require('path');

// Constants
const AYANAMSA = swisseph.SE_SIDM_LAHIRI; // Lahiri ayanamsa (most commonly used in India)
const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", swe_id: swisseph.SE_SUN, color: "#FFA500" },
  { id: "mo", name: "Moon", symbol: "☽", swe_id: swisseph.SE_MOON, color: "#SILVER" },
  { id: "me", name: "Mercury", symbol: "☿", swe_id: swisseph.SE_MERCURY, color: "#00FF00" },
  { id: "ve", name: "Venus", symbol: "♀", swe_id: swisseph.SE_VENUS, color: "#FFFFFF" },
  { id: "ma", name: "Mars", symbol: "♂", swe_id: swisseph.SE_MARS, color: "#FF0000" },
  { id: "ju", name: "Jupiter", symbol: "♃", swe_id: swisseph.SE_JUPITER, color: "#FFFF00" },
  { id: "sa", name: "Saturn", symbol: "♄", swe_id: swisseph.SE_SATURN, color: "#000080" },
  { id: "ra", name: "Rahu", symbol: "☊", swe_id: swisseph.SE_MEAN_NODE, color: "#4B0082" },
  { id: "ke", name: "Ketu", symbol: "☋", swe_id: -1, color: "#800000" } // Ketu is calculated from Rahu
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

// Set ephemeris path
const ephePath = path.join(__dirname, '../ephe');
swisseph.swe_set_ephe_path(ephePath);

/**
 * Calculate Julian Day Number from date components
 * Based on the logic from VedAstro repository
 */
function calculateJulianDay(year, month, day, hour, minute, timezone) {
  // Convert to UTC based on timezone
  const dt = DateTime.fromObject({
    year, 
    month, 
    day, 
    hour, 
    minute
  }, { zone: timezone }).toUTC();
  
  // Get UTC components
  const utcYear = dt.year;
  const utcMonth = dt.month;
  const utcDay = dt.day;
  const utcHour = dt.hour;
  const utcMinute = dt.minute;
  const utcSecond = dt.second;
  
  // Calculate Julian day
  return swisseph.swe_julday(
    utcYear, 
    utcMonth, 
    utcDay, 
    utcHour + utcMinute / 60 + utcSecond / 3600, 
    swisseph.SE_GREG_CAL
  );
}

/**
 * Calculate planet position using Swiss Ephemeris
 */
function calculatePlanetPosition(julDay, planetId) {
  // Special case for Ketu (South Node)
  if (planetId === -1) {
    // Ketu is exactly 180 degrees opposite to Rahu
    const rahuPosition = calculatePlanetPosition(julDay, swisseph.SE_MEAN_NODE);
    let ketuLongitude = (rahuPosition.longitude + 180) % 360;
    
    return {
      longitude: ketuLongitude,
      latitude: -rahuPosition.latitude,
      distance: rahuPosition.distance,
      longitudeSpeed: -rahuPosition.longitudeSpeed,
      retrograde: rahuPosition.retrograde
    };
  }
  
  // Set ayanamsa mode (Lahiri)
  swisseph.swe_set_sid_mode(AYANAMSA, 0, 0);
  
  // Calculate planet position
  const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
  const result = swisseph.swe_calc_ut(julDay, planetId, flag);
  
  if (result.error) {
    throw new Error(`Error calculating position for planet ID ${planetId}: ${result.error}`);
  }
  
  // Extract the values we need
  const longitude = result.longitude;
  const latitude = result.latitude;
  const distance = result.distance;
  const longitudeSpeed = result.speedLong;
  const retrograde = longitudeSpeed < 0;
  
  return { longitude, latitude, distance, longitudeSpeed, retrograde };
}

/**
 * Calculate house cusps using Swiss Ephemeris
 */
function calculateHouseCusps(julDay, latitude, longitude) {
  // Convert longitude to east longitude as required by Swiss Ephemeris
  const eastLongitude = longitude;
  
  // Set ayanamsa mode (Lahiri)
  swisseph.swe_set_sid_mode(AYANAMSA, 0, 0);
  
  // Calculate houses (Placidus system)
  const result = swisseph.swe_houses(julDay, latitude, eastLongitude, 'P');
  
  if (!result || !result.house) {
    throw new Error('Error calculating house cusps');
  }
  
  // Format the result
  const houses = result.house.map((longitude, index) => ({
    number: index + 1,
    longitude,
    sign: Math.floor(longitude / 30)
  }));
  
  return houses;
}

/**
 * Calculate moon nakshatra based on moon longitude
 */
function getMoonNakshatra(moonLongitude) {
  // Each nakshatra is 13°20' (13.333 degrees)
  const nakshatraIndex = Math.floor((moonLongitude * 27) / 360);
  return NAKSHATRAS[nakshatraIndex % 27];
}

/**
 * Calculate tithi (lunar day) based on difference between moon and sun longitude
 */
function calculateLunarDay(sunLongitude, moonLongitude) {
  // Tithi is the longitudinal distance between the Moon and the Sun divided by 12 degrees
  const difference = (moonLongitude - sunLongitude + 360) % 360;
  const tithi = Math.floor(difference / 12) + 1;
  return tithi;
}

/**
 * Calculate full Vedic chart
 */
function calculateVedicChart(birthDate, birthTime, latitude, longitude, timezone) {
  try {
    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Calculate Julian day
    const julDay = calculateJulianDay(year, month, day, hour, minute, timezone);
    
    // Calculate planet positions
    const planets = PLANETS.map(planet => {
      const position = calculatePlanetPosition(julDay, planet.swe_id);
      const sign = Math.floor(position.longitude / 30);
      
      return {
        id: planet.id,
        name: planet.name,
        symbol: planet.symbol,
        longitude: position.longitude,
        sign: sign,
        retrograde: position.retrograde,
        color: planet.color
      };
    });
    
    // Calculate house cusps
    const houses = calculateHouseCusps(julDay, latitude, longitude);
    
    // Get ascendant (Lagna) - first house cusp
    const ascendant = houses[0].longitude;
    
    // Assign houses to planets
    planets.forEach(planet => {
      // Find which house the planet is in
      for (let i = 0; i < houses.length; i++) {
        const nextHouseIndex = (i + 1) % 12;
        const houseStart = houses[i].longitude;
        const houseEnd = houses[nextHouseIndex].longitude;
        
        if (houseEnd < houseStart) {
          // House spans 0 degrees (crosses Aries point)
          if (planet.longitude >= houseStart || planet.longitude < houseEnd) {
            planet.house = houses[i].number;
            break;
          }
        } else {
          // Normal case
          if (planet.longitude >= houseStart && planet.longitude < houseEnd) {
            planet.house = houses[i].number;
            break;
          }
        }
        
        // Fallback if house calculation fails
        if (i === houses.length - 1) {
          planet.house = 1; // Default to first house
        }
      }
    });
    
    // Get Moon Nakshatra
    const moonPlanet = planets.find(p => p.id === "mo");
    const moonNakshatra = moonPlanet ? getMoonNakshatra(moonPlanet.longitude) : "Unknown";
    
    // Calculate Lunar Day (Tithi)
    const sunPlanet = planets.find(p => p.id === "su");
    const moonPlanet2 = planets.find(p => p.id === "mo");
    const lunarDay = (sunPlanet && moonPlanet2) 
      ? calculateLunarDay(sunPlanet.longitude, moonPlanet2.longitude)
      : 1;
    
    // Return complete chart data
    return {
      ascendant,
      planets,
      houses,
      moonNakshatra,
      lunarDay
    };
  } catch (error) {
    console.error("Error calculating chart:", error);
    throw error;
  }
}

/**
 * Netlify function handler
 */
exports.handler = async function(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['birthDate', 'birthTime', 'latitude', 'longitude', 'timezone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        };
      }
    }
    
    // Calculate chart
    const chart = calculateVedicChart(
      body.birthDate,
      body.birthTime,
      body.latitude,
      body.longitude,
      body.timezone
    );
    
    // Return the chart data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(chart)
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
