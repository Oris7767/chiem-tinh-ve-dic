
# Vedic Astrology Integration Guide

## Overview

This module provides Vedic astrology chart calculations using Swiss Ephemeris. The current implementation uses a fallback calculation mode for development purposes, but it's designed to be integrated with a dedicated Swiss Ephemeris server for production use.

## Architecture

The implementation follows these key principles:

1. **Separation of Concerns**:
   - Frontend components handle UI and user interaction
   - Backend service performs the complex astronomical calculations

2. **Calculation Flow** (based on VedAstro repository logic):
   - Convert input time to Julian day
   - Use ayanamsa to get sidereal coordinates of planets
   - Calculate house positions and other chart details

## Setting Up Swiss Ephemeris Server

To deploy a proper Swiss Ephemeris server, you have several options:

### Option 1: Custom Node.js Server

1. Create a Node.js server using Express
2. Install the `swisseph` NPM package: https://www.npmjs.com/package/swisseph
3. Create an API endpoint that accepts birth details and returns chart data
4. Deploy to a service like Heroku, AWS, or Digital Ocean
5. Update the `API_URL` in `config.ts` to point to your server

Example of a basic Node.js Swiss Ephemeris server:

```javascript
const express = require('express');
const cors = require('cors');
const swisseph = require('swisseph');
const app = express();
const PORT = process.env.PORT || 3000;

// Set path to ephemeris files
swisseph.swe_set_ephe_path(__dirname + '/ephe');

app.use(cors());
app.use(express.json());

app.post('/api/calculate', (req, res) => {
  try {
    const { birthDate, birthTime, latitude, longitude, timezone } = req.body;
    
    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Calculate Julian day
    const julday_ut = swisseph.swe_julday(
      year, month, day, hour + minute / 60, swisseph.SE_GREG_CAL
    );
    
    // Set ayanamsa (Lahiri)
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    
    // Calculate planets, houses, etc.
    // ... (implementation based on VedAstro repository logic)
    
    // Return the chart data
    res.json(chartData);
  } catch (error) {
    console.error('Error calculating chart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Option 2: Use VedAstro API

The VedAstro project may offer an API that you could use directly:
1. Check if the VedAstro repository provides API access
2. Obtain API credentials if required
3. Update the service to call their API instead

### Option 3: WebAssembly (Advanced)

For a completely client-side solution:
1. Port Swiss Ephemeris to WebAssembly
2. Load ephemeris data files from a CDN
3. Perform calculations directly in the browser

## Switching to Production Mode

Once your Swiss Ephemeris server is ready:

1. Update `src/utils/vedicAstrology/config.ts`:
   ```typescript
   export const VEDIC_ASTRO_API_CONFIG = {
     API_URL: "https://your-swiss-ephemeris-server.com/api/calculate",
     FALLBACK_MODE: false, // Set to false to use the real server
   };
   ```

2. Test thoroughly with various birth dates and locations

## References

- VedAstro Repository: https://github.com/VedAstro/VedAstro
- Swiss Ephemeris Documentation: https://www.astro.com/swisseph/swephprg.htm
- Swiss Ephemeris NPM Package: https://www.npmjs.com/package/swisseph
