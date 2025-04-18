const swisseph = require('swisseph');

console.log('Swiss Ephemeris loaded successfully');

// Set the ephemeris path
swisseph.swe_set_ephe_path('./ephe');

// Test a simple calculation
const julday = swisseph.swe_julday(1990, 1, 1, 12, 1); // 1990-01-01 12:00
const moon = swisseph.swe_calc_ut(julday, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH);
console.log('Moon position:', moon);