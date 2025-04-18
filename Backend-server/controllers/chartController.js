const supabaseService = require('../services/supabaseService');
const swisseph = require('swisseph');
const path = require('path');

// Đặt đường dẫn cho dữ liệu ephemeris
swisseph.swe_set_ephe_path(path.join(__dirname, '../ephe'));

class ChartController {
  async calculateChart(req, res) {
    try {
      const { 
        birthDate, 
        birthTime, 
        latitude, 
        longitude, 
        timezone,
        name
      } = req.body;
      
      // Validate input
      if (!birthDate || !birthTime || !latitude || !longitude || !timezone) {
        return res.status(400).json({ error: 'Missing required chart data' });
      }
      
      // Convert birth date and time to Julian day
      const date = new Date(`${birthDate}T${birthTime}`);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      const hour = date.getUTCHours() + date.getUTCMinutes() / 60.0 + date.getUTCSeconds() / 3600.0;
      
      const julDay = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
      
      // Calculate ayanamsa (Lahiri by default)
      swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
      const ayanamsa = swisseph.swe_get_ayanamsa(julDay);
      
      // Calculate planets
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
        { id: swisseph.SE_MEAN_NODE, name: 'Rahu' }
      ];
      
      for (const body of bodies) {
        const flag = body.id === swisseph.SE_MEAN_NODE ? swisseph.SEFLG_SWIEPH : swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
        const result = swisseph.swe_calc_ut(julDay, body.id, flag);
        
        if (result.error) {
          console.error(`Error calculating ${body.name}:`, result.error);
          continue;
        }
        
        // Convert to sidereal longitude
        const siderealLong = (result.longitude - ayanamsa + 360) % 360;
        
        // Calculate zodiac sign
        const signNum = Math.floor(siderealLong / 30);
        const signNames = [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        
        planets.push({
          name: body.name,
          longitude: siderealLong,
          longitudeTropical: result.longitude,
          latitude: result.latitude,
          speed: result.speed,
          sign: signNames[signNum],
          signNum,
          position: siderealLong % 30 // Position within sign
        });
      }
      
      // Calculate ascendant and houses
      const houses = [];
      const geopos = [longitude, latitude, 0]; // [longitude, latitude, altitude]
      const hsys = 'P'; // Placidus house system
      
      const houseResult = swisseph.swe_houses(julDay, geopos[1], geopos[0], hsys);
      
      // Sidereal ascendant
      const ascendant = (houseResult.ascendant - ayanamsa + 360) % 360;
      const ascSignNum = Math.floor(ascendant / 30);
      
      // Calculate houses
      for (let i = 0; i < 12; i++) {
        const houseCusp = (houseResult.house[i] - ayanamsa + 360) % 360;
        const houseSignNum = Math.floor(houseCusp / 30);
        
        houses.push({
          number: i + 1,
          longitude: houseCusp,
          longitudeTropical: houseResult.house[i],
          sign: signNames[houseSignNum],
          signNum: houseSignNum,
          position: houseCusp % 30
        });
      }
      
      // Calculate aspects between planets
      const aspects = [];
      const aspectTypes = [
        { name: 'Conjunction', angle: 0, orb: 10 },
        { name: 'Opposition', angle: 180, orb: 10 },
        { name: 'Trine', angle: 120, orb: 8 },
        { name: 'Square', angle: 90, orb: 8 },
        { name: 'Sextile', angle: 60, orb: 6 }
      ];
      
      for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
          const p1 = planets[i];
          const p2 = planets[j];
          
          // Calculate the angle between planets
          let angle = Math.abs(p1.longitude - p2.longitude);
          if (angle > 180) angle = 360 - angle;
          
          // Check if this angle matches any aspect type
          for (const aspectType of aspectTypes) {
            const diff = Math.abs(angle - aspectType.angle);
            if (diff <= aspectType.orb) {
              aspects.push({
                planet1: p1.name,
                planet2: p2.name,
                type: aspectType.name,
                angle: aspectType.angle,
                orb: diff.toFixed(2)
              });
              break;
            }
          }
        }
      }
      
      // Create the final chart data
      const chartData = {
        name: name || 'Birth Chart',
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone,
        julianDay: julDay,
        ayanamsa,
        ascendant: {
          longitude: ascendant,
          sign: signNames[ascSignNum],
          signNum: ascSignNum,
          position: ascendant % 30
        },
        planets,
        houses,
        aspects
      };
      
      // Save to database if user is authenticated
      if (req.user) {
        const birthPlace = req.body.birthPlace || `Lat: ${latitude}, Long: ${longitude}`;
        
        const savedChart = await supabaseService.createBirthChart({
          user_id: req.user.id,
          name: name || 'Birth Chart',
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace,
          latitude,
          longitude,
          timezone,
          chart_data: chartData,
          is_public: req.body.isPublic || false
        });
        
        return res.json({
          chart: chartData,
          savedChart
        });
      }
      
      // Return calculated chart
      res.json({ chart: chartData });
    } catch (error) {
      console.error('Chart calculation error:', error);
      res.status(500).json({ error: error.message || 'Failed to calculate chart' });
    }
  }
  
  async getUserCharts(req, res) {
    try {
      const userId = req.user.id;
      const charts = await supabaseService.getBirthCharts(userId);
      res.json(charts);
    } catch (error) {
      console.error('Error fetching user charts:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch charts' });
    }
  }
  
  async getChartById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const chart = await supabaseService.getBirthChart(id, userId);
      
      if (!chart) {
        return res.status(404).json({ error: 'Chart not found' });
      }
      
      res.json(chart);
    } catch (error) {
      console.error('Error fetching chart:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch chart' });
    }
  }
  
  async updateChart(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;
      
      // Prevent updating critical fields
      delete updates.user_id;
      delete updates.id;
      
      const updatedChart = await supabaseService.updateBirthChart(id, userId, updates);
      res.json(updatedChart);
    } catch (error) {
      console.error('Error updating chart:', error);
      res.status(500).json({ error: error.message || 'Failed to update chart' });
    }
  }
  
  async deleteChart(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await supabaseService.deleteBirthChart(id, userId);
      res.json({ success: true, message: 'Chart deleted successfully' });
    } catch (error) {
      console.error('Error deleting chart:', error);
      res.status(500).json({ error: error.message || 'Failed to delete chart' });
    }
  }
  
  async getInterpretation(req, res) {
    try {
      const { category, subCategory } = req.params;
      
      const interpretations = await supabaseService.getInterpretations(category, subCategory);
      
      if (!interpretations || interpretations.length === 0) {
        return res.status(404).json({ error: 'Interpretation not found' });
      }
      
      res.json(interpretations);
    } catch (error) {
      console.error('Error fetching interpretation:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch interpretation' });
    }
  }
}

module.exports = new ChartController();
