import { SIGNS, getSignByDegree } from './Signs';
import { NAKSHATRAS } from './Nakshatras';
import { getPlanetDignity } from './Planets';

export function getRashi(longitude: number): string {
  const sign = getSignByDegree(longitude);
  return sign.sanskritName;
}

export function getNakshatra(longitude: number): { name: string; pada: number } {
  const normalized = longitude % 360;
  const nakshatra = NAKSHATRAS.find(
    (n) => normalized >= n.startDegree && normalized < n.endDegree,
  );
  if (!nakshatra) return { name: 'Unknown', pada: 1 };

  const pada = nakshatra.padas.find(
    (p) => normalized >= p.startDegree && normalized < p.endDegree,
  );
  return { name: nakshatra.sanskritName, pada: pada?.number || 1 };
}

export function getPlanetDetails(name: string, longitude: number, signId: number) {
  const rashi = getRashi(longitude);
  const { name: nakshatra, pada } = getNakshatra(longitude);
  const dignity = getPlanetDignity(name, signId);
  return { name, longitude, rashi, nakshatra, pada, dignity };
}