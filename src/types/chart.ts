export interface Planet {
  name: string;
  longitude: number;
  rashi: string;
  nakshatra: string;
  pada: number;
}

export interface House {
  house: number;
  rashi: string;
}

export interface Ascendant {
  degree: number;
  rashi: string;
  nakshatra?: string;
  pada?: number;
}

export interface BirthChart {
  planets: Planet[];
  houses: House[];
  ascendant: Ascendant;
}