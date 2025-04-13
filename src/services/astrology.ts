import swisseph from 'swisseph';
import { BirthChart } from '../types/chart';
import { getPlanetDetails, getRashi } from '../utils/VedicAstro/calculations';
import { PLANETS } from '../utils/VedicAstro/Planets';

// Set ephemeris path
swisseph.swe_set_ephe_path('./public/ephe');

export async function calculateBirthChart(date: Date, lat: number, lon: number): Promise<BirthChart> {
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
  );

  // Calculate planets
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

  const planets = await Promise.all(
    Object.keys(planetIds).map(async (name) => {
      const id = planetIds[name];
      const result = await swisseph.swe_calc_ut(jd, id, swisseph.SEFLG_SIDEREAL);
      const longitude = result[0];
      const signId = Math.floor(longitude / 30);
      return getPlanetDetails(name, longitude, signId);
    }),
  );

  // Calculate Ketu (opposite Rahu)
  const rahu = planets.find((p) => p.name === 'RAHU')!;
  const ketuLongitude = (rahu.longitude + 180) % 360;
  const ketuSignId = Math.floor(ketuLongitude / 30);
  planets.push(getPlanetDetails('KETU', ketuLongitude, ketuSignId));

  // Calculate ascendant and houses (whole-sign)
  const ascendant = await swisseph.swe_houses(jd, lat, lon, 'W');
  const ascDegree = ascendant.ascendant;
  const ascRashi = getRashi(ascDegree);
  const ascSignId = Math.floor(ascDegree / 30);

  const houses = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    rashi: Object.values(PLANETS)[(ascSignId + i) % 12].sanskritName,
  }));

  return {
    planets,
    houses,
    ascendant: { degree: ascDegree, rashi: ascRashi },
  };
}