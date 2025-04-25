// backend-server/services/astroService.js
const swisseph = require('swisseph');

// Đường dẫn đến ephemeris files
swisseph.swe_set_ephe_path(__dirname + '/../ephemeris');

exports.calculateChart = async ({ birth_date, birth_time, latitude, longitude, timezone }) => {
  try {
    // Parse date and time
    const [year, month, day] = birth_date.split('-').map(Number);
    const [hour, minute] = birth_time.split(':').map(Number);
    
    // Calculate Julian day
    const julday = swisseph.swe_julday(
      year,
      month,
      day,
      hour + minute / 60,
      swisseph.SE_GREG_CAL
    );
    
    // Apply timezone offset
    const tzOffset = getTimezoneOffset(timezone, new Date(`${birth_date}T${birth_time}:00`));
    const julday_ut = julday - tzOffset / 24;
    
    // Calculate ayanamsa (Lahiri)
    const ayanamsa = swisseph.swe_get_ayanamsa_ex_ut(julday_ut, swisseph.SE_SIDM_LAHIRI);
    
    // Calculate planets
    const planets = calculatePlanets(julday_ut);
    
    // Calculate houses (Placidus)
    const houses = calculateHouses(julday_ut, latitude, longitude);
    
    // Calculate ascendant
    const ascendant = calculateAscendant(julday_ut, latitude, longitude);
    
    // Calculate nakshatras
    const nakshatras = calculateNakshatras(planets);
    
    // Calculate dashas
    const dashas = calculateDashas(julday_ut, planets);
    
    return {
      ayanamsa,
      planets,
      houses,
      ascendant,
      nakshatras,
      dashas
    };
  } catch (error) {
    console.error('Error calculating chart:', error);
    throw new Error('Failed to calculate astrological chart');
  }
};

function getTimezoneOffset(timezone, date) {
  // Implement timezone offset calculation
  // This is a simplified version - consider using a library like moment-timezone
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - date.getTime()) / (60 * 60 * 1000);
}

function calculatePlanets(julday_ut) {
  const planets = [];
  const bodies = [
    { id: swisseph.SE_SUN, name: 'Sun' },
    { id: swisseph.SE_MOON, name: 'Moon' },
    { id: swisseph.SE_MERCURY, name: 'Mercury' },
    { id: swisseph.SE_VENUS, name: 'Venus' },
    { id: swisseph.SE_MARS, name: 'Mars' },
    { id: swisseph.SE_JUPITER, name: 'Jupiter' },
    { id: swisseph.SE_SATURN, name: 'Saturn' },
    { id: swisseph.SE_URANUS, name: 'Uranus' },
    { id: swisseph.SE_NEPTUNE, name: 'Neptune' },
    { id: swisseph.SE_PLUTO, name: 'Pluto' },
    { id: swisseph.SE_MEAN_NODE, name: 'Rahu' }, // North Node
    // Calculate Ketu (South Node) separately
  ];
  
  for (const body of bodies) {
    const result = swisseph.swe_calc_ut(julday_ut, body.id, swisseph.SEFLG_SIDEREAL);
    planets.push({
      name: body.name,
      longitude: result.longitude,
      latitude: result.latitude,
      speed: result.speed,
      sign: Math.floor(result.longitude / 30) + 1,
      house: getHousePosition(result.longitude, houses)
    });
  }
  
  // Calculate Ketu (South Node)
  const rahu = planets.find(p => p.name === 'Rahu');
  if (rahu) {
    planets.push({
      name: 'Ketu',
      longitude: (rahu.longitude + 180) % 360,
      latitude: -rahu.latitude,
      speed: rahu.speed,
      sign: Math.floor(((rahu.longitude + 180) % 360) / 30) + 1,
      house: getHousePosition((rahu.longitude + 180) % 360, houses)
    });
  }
  
  return planets;
}

function calculateHouses(julday_ut, latitude, longitude) {
  const result = swisseph.swe_houses(
    julday_ut,
    latitude,
    longitude,
    'P' // Placidus
  );
  
  return result.house.map((cusp, index) => ({
    number: index + 1,
    cusp: cusp,
    sign: Math.floor(cusp / 30) + 1
  }));
}

function calculateAscendant(julday_ut, latitude, longitude) {
  const result = swisseph.swe_houses(
    julday_ut,
    latitude,
    longitude,
    'P' // Placidus
  );
  
  return {
    longitude: result.ascendant,
    sign: Math.floor(result.ascendant / 30) + 1
  };
}

function getHousePosition(longitude, houses) {
  // Implement logic to determine which house a planet is in
  // This is a simplified version
  for (let i = 0; i < houses.length; i++) {
    const nextHouse = houses[(i + 1) % houses.length];
    if (
      (longitude >= houses[i].cusp && longitude < nextHouse.cusp) ||
      (houses[i].cusp > nextHouse.cusp && (longitude >= houses[i].cusp || longitude < nextHouse.cusp))
    ) {
      return i + 1;
    }
  }
  return 1; // Default to first house if not found
}

function calculateNakshatras(planets) {
  // Implement nakshatra calculations
  const nakshatras = [];
  const nakshatra_names = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  
  for (const planet of planets) {
    const nakshatra_index = Math.floor(planet.longitude * 27 / 360);
    const nakshatra_pada = Math.floor((planet.longitude * 108 / 360) % 4) + 1;
    
    nakshatras.push({
      planet: planet.name,
      nakshatra: nakshatra_names[nakshatra_index],
      pada: nakshatra_pada
    });
  }
  
  return nakshatras;
}

function calculateDashas(julday_ut, planets) {
  // Implement Vimshottari Dasha calculations
  // This is a simplified version
  const moon = planets.find(p => p.name === 'Moon');
  if (!moon) return [];
  
  const dasha_lords = [
    { planet: 'Ketu', years: 7 },
    { planet: 'Venus', years: 20 },
    { planet: 'Sun', years: 6 },
    { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 },
    { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 },
    { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 }
  ];
  
  // Calculate moon's nakshatra
  const moon_nakshatra_index = Math.floor(moon.longitude * 27 / 360);
  
  // Calculate dasha balance
  const nakshatra_degree = (moon.longitude * 27 / 360) % 1;
  const dasha_lord_index = moon_nakshatra_index % 9;
  const dasha_balance = (1 - nakshatra_degree) * dasha_lords[dasha_lord_index].years;
  
  // Calculate current dasha and future dashas
  const dashas = [];
  let current_dasha_lord_index = dasha_lord_index;
  let remaining_years = dasha_balance;
  
  // Current dasha
  dashas.push({
    planet: dasha_lords[current_dasha_lord_index].planet,
    start_date: new Date(Date.now() - remaining_years * 365.25 * 24 * 60 * 60 * 1000),
    end_date: new Date(),
    years: dasha_balance
  });
  
  // Future dashas
  for (let i = 1; i <= 8; i++) {
    current_dasha_lord_index = (current_dasha_lord_index + 1) % 9;
    const start_date = new Date(dashas[i-1].end_date);
    const years = dasha_lords[current_dasha_lord_index].years;
    const end_date = new Date(start_date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
    
    dashas.push({
      planet: dasha_lords[current_dasha_lord_index].planet,
      start_date,
      end_date,
      years
    });
  }
  
  return dashas;
}
