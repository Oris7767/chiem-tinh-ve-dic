import { Planet } from '../../types/chart';
import { Nakshatra, Pada } from './Nakshatras';
import { SIGNS } from './Signs';

export function getRashi(degree: number): string {
  const normalizedDegree = degree % 360;
  const signId = Math.floor(normalizedDegree / 30);
  return SIGNS[signId].sanskritName;
}

export function getPlanetDetails(
  name: string,
  longitude: number,
  signId: number,
  nakshatraData: { nakshatra: Nakshatra; pada: Pada } | null = null,
): Planet {
  return {
    name,
    longitude,
    rashi: SIGNS[signId].sanskritName,
    nakshatra: nakshatraData?.nakshatra.sanskritName ?? 'Unknown',
    pada: nakshatraData?.pada.number ?? 0,
  };
}