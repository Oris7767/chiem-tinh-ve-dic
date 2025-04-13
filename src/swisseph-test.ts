import swisseph from 'swisseph';

swisseph.swe_set_ephe_path('./public/ephe');
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI);

const date = { year: 1990, month: 1, day: 1, hour: 12 };
const jd = swisseph.swe_julday(date.year, date.month, date.day, date.hour, swisseph.SE_GREG_CAL);

console.log('Julian Day:', jd);

swisseph.swe_calc_ut(jd, swisseph.SE_SUN, swisseph.SEFLG_SIDEREAL, (result: any) => {
  console.log('Sun Longitude:', result.longitude);
});

swisseph.swe_calc_ut(jd, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL, (result: any) => {
  console.log('Moon Longitude:', result.longitude);
});