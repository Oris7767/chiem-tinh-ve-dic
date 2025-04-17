const express = require('express');
const swisseph = require('swisseph');
const app = express();

app.use(express.json());

// Initialize Swiss Ephemeris
swisseph.swe_set_ephe_path('./ephe'); // Path to ephemeris files (download from www.astro.com)

app.post('/calculate-planets', (req, res) => {
  const { birth_date, latitude, longitude } = req.body;

  // Convert birth_date to Julian Day
  const date = new Date(birth_date);
  const julday = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours() + date.getMinutes() / 60,
    1 // Gregorian calendar
  );

  // Calculate planetary positions
  const planets = {};
  const planetIds = [
    swisseph.SUN, swisseph.MOON, swisseph.MARS, swisseph.MERCURY,
    swisseph.JUPITER, swisseph.VENUS, swisseph.SATURN, swisseph.RAHU,
    swisseph.KETU,
  ];

  planetIds.forEach((planetId) => {
    const result = swisseph.swe_calc_ut(julday, planetId);
    planets[swisseph.swe_get_planet_name(planetId).toLowerCase()] = {
      longitude: result.data[0], // Ecliptic longitude
      latitude: result.data[1],  // Ecliptic latitude
      distance: result.data[2],  // Distance from Earth
    };
  });

  // Adjust for house calculation (simplified)
  const ascendant = swisseph.swe_houses_ex(julday, 0, [latitude, longitude], 'P').ascendant;

  res.json({ planets, ascendant });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));