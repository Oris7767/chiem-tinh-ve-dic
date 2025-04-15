import swisseph from 'swisseph';
import { BirthChart } from '../types/chart';
import { getPlanetDetails, getRashi } from '../utils/VedicAstro/calculations';
import { PLANETS } from '../utils/VedicAstro/Planets';
import { nakshatras, Nakshatra, Pada } from '../utils/VedicAstro/Nakshatras';

// Set ephemeris path
try {
  swisseph.swe_set_ephe_path('/ephe');
} catch (error) {
  console.error('Failed to set ephemeris path:', error);
}

// Helper function to find Nakshatra and Pada
function getNakshatraAndPada(longitude: number): { nakshatra: Nakshatra; pada: Pada } | null {
  const normalizedLongitude = longitude % 360;
  for (const nakshatra of nakshatras) {
    if (normalizedLongitude >= nakshatra.startDegree && normalizedLongitude < nakshatra.endDegree) {
      for (const pada of nakshatra.padas) {
        if (normalizedLongitude >= pada.startDegree && normalizedLongitude < pada.endDegree) {
          return { nakshatra, pada };
        }
      }
    }
  }
  return null;
}

export async function calculateBirthChart(date: Date, lat: number, lon: number): Promise<BirthChart> {
  // Validate inputs
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Invalid coordinates');
  }

  // Set sidereal mode (Lahiri ayanamsa)
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI);

  // Calculate Julian day
  const jd = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours() + date.getMinutes() / 60,
    swisseph.SE_GREG_CAL,
  );

  // Define planet mappings
  const planetIds: Record<string, number> = {
    SUN: swisseph.SE_SUN,
    MOON: swisseph.SE_MOON,
    MARS: swisseph.SE_MARS,
    MERCURY: swisseph.SE_MERCURY,
    JUPITER: swisseph.SE_JUPITER,
    VENUS: swisseph.SE_VENUS,
    SATURN: swisseph.SE_SATURN,
    RAHU: swisseph.SE_MEAN_NODE,
  };

  // Calculate planets
  const planets = await Promise.all(
    Object.keys(planetIds).map(async (name) => {
      const id = planetIds[name];
      const result = await new Promise((resolve, reject) => {
        swisseph.swe_calc_ut(jd, id, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED, (res: any) => {
          if (res.error) reject(res.error);
          resolve(res);
        });
      });
      const longitude = result.longitude;
      const signId = Math.floor(longitude / 30);
      const nakshatraData = getNakshatraAndPada(longitude);
      return getPlanetDetails(name, longitude, signId, nakshatraData);
    }),
  );

  // Calculate Ketu (opposite Rahu)
  const rahu = planets.find((p) => p.name === 'RAHU')!;
  const ketuLongitude = (rahu.longitude + 180) % 360;
  const ketuSignId = Math.floor(ketuLongitude / 30);
  const ketuNakshatraData = getNakshatraAndPada(ketuLongitude);
  planets.push(getPlanetDetails('KETU', ketuLongitude, ketuSignId, ketuNakshatraData));

  // Calculate ascendant and houses (whole-sign)
  const houseResult = await new Promise((resolve, reject) => {
    swisseph.swe_houses(jd, lat, lon, 'W'.charCodeAt(0), (res: any) => {
      if (res.error) reject(res.error);
      resolve(res);
    });
  });
  const ascDegree = houseResult.ascendant;
  const ascRashi = getRashi(ascDegree);
  const ascSignId = Math.floor(ascDegree / 30);
  const ascNakshatraData = getNakshatraAndPada(ascDegree);

  const houses = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    rashi: Object.values(PLANETS)[(ascSignId + i) % 12].sanskritName,
  }));

  return {
    planets,
    houses,
    ascendant: {
      degree: ascDegree,
      rashi: ascRashi,
      nakshatra: ascNakshatraData?.nakshatra.sanskritName,
      pada: ascNakshatraData?.pada.number,
    },
  };
}