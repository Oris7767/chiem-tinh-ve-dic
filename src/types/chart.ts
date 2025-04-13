import { PlanetName } from '../utils/VedicAstro/Planets';
import { SignId } from '../utils/VedicAstro/Signs';

export interface Planet {
  name: PlanetName;
  longitude: number;
  rashi: string;
  nakshatra: string;
  pada: number;
  dignity?: 'exalted' | 'debilitated' | 'own sign' | 'neutral';
}

export interface House {
  house: number; // 1-12
  rashi: string;
}

export interface BirthChart {
  planets: Planet[];
  houses: House[];
  ascendant: {
    degree: number;
    rashi: string;
  };
}