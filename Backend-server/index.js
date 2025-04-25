const express = require('express');
const swisseph = require('swisseph');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Check if ephemeris directory exists and show contents
const ephePath = path.resolve('./ephe');
console.log('Ephemeris path:', ephePath);
console.log('Directory exists:', fs.existsSync(ephePath));
if (fs.existsSync(ephePath)) {
  console.log('Directory contents:', fs.readdirSync(ephePath));
} else {
  console.error('WARNING: Ephemeris directory does not exist!');
}

// Set the ephemeris path
try {
  swisseph.swe_set_ephe_path('./ephe');
  console.log('Ephemeris path set successfully');
  
  // Test calculation to verify ephemeris files
  const testJd = swisseph.swe_julday(2000, 1, 1, 0, 1);
  const testResult = swisseph.swe_calc_ut(testJd, 0, 2);
  console.log('Test calculation result:', testResult);
} catch (error) {
  console.error('Failed to set ephemeris path or perform test calculation:', error);
}

app.get('/', (req, res) => {
  try {
    res.send('Swiss Ephemeris Server is running!');
  } catch (error) {
    console.error('Error in root route:', error);
    res.status(500).send('Server error');
  }
});

// Planet ID to name mapping
const planetNames = {
  0: 'sun',
  1: 'moon',
  2: 'mars',
  3: 'mercury',
  4: 'jupiter',
  5: 'venus',
  6: 'saturn',
  11: 'mean_node', // Will be renamed to 'rahu' later
};

app.post('/calculate-planets', (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { birth_date, latitude, longitude } = req.body;

    if (!birth_date || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields', received: req.body });
    }

    const date = new Date(birth_date);
    console.log('Parsed date:', date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid birth_date format', received: birth_date });
    }

    const julday = swisseph.swe_julday(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours() + date.getMinutes() / 60,
      1
    );
    console.log('Julian Day:', julday);
    if (typeof julday !== 'number' || isNaN(julday)) {
      return res.status(500).json({ error: 'Failed to calculate Julian Day' });
    }

    const planets = {};
    const planetIds = [0, 1, 2, 3, 4, 5, 6, 11];

    for (const planetId of planetIds) {
      try {
        const result = swisseph.swe_calc_ut(julday, planetId, 2);
        console.log(`Result for planet ${planetId}:`, result);
        
        if (!result) {
          throw new Error(`Result is null or undefined for planet ${planetId}`);
        }
        
        if (
          typeof result !== 'object' ||
          !('longitude' in result) ||
          !('latitude' in result) ||
          !('distance' in result) ||
          !('rflag' in result)
        ) {
          throw new Error(`Invalid result format for planet ${planetId}`);
        }
        
        if (result.rflag < 0) {
          throw new Error(`Calculation failed for planet ${planetId}, rflag: ${result.rflag}`);
        }
        
        const planetName = planetNames[planetId];
        if (!planetName) {
          throw new Error(`Unknown planet ID: ${planetId}`);
        }
        
        planets[planetName] = {
          longitude: result.longitude,
          latitude: result.latitude,
          distance: result.distance,
        };
      } catch (error) {
        console.error(`Error calculating planet ${planetId}:`, error);
        return res.status(500).json({ error: `Failed to calculate planet ${planetId}`, details: error.message });
      }
    }

    // Calculate Ketu (180° opposite to Rahu)
    planets.ketu = {
      longitude: (planets.mean_node.longitude + 180) % 360,
      latitude: -planets.mean_node.latitude,
      distance: planets.mean_node.distance,
    };
    planets.rahu = planets.mean_node; // Rename mean_node to rahu
    delete planets.mean_node;

    try {
      const houses = swisseph.swe_houses(julday, latitude, longitude, 'P');
      console.log('Houses:', houses);
      const ascendant = houses.ascendant;

      res.json({ planets, ascendant, houses: houses.houses });
    } catch (error) {
      console.error('Error calculating houses:', error);
      res.status(500).json({ error: 'Failed to calculate houses', details: error.message });
    }
  } catch (error) {
    console.error('Error in /calculate-planets:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
