/**
 * PDF Module Types - Tách biệt với web UI
 * Định nghĩa các interfaces cho báo cáo PDF
 */

// Nakshatra info
export interface PdfNakshatraInfo {
  name: string;
  lord: string;
  startDegree: number;
  endDegree: number;
  pada: number;
}

// Planet
export interface PdfPlanet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  longitudeSpeed: number;
  sign: number;
  house: number;
  retrograde: boolean;
  color: string;
  nakshatra: PdfNakshatraInfo;
  aspectingPlanets: string[];
  aspects: Array<{
    planet: string;
    type: string;
    orb: number;
  }>;
}

// House
export interface PdfHouse {
  number: number;
  longitude: number;
  sign: number;
  planets: string[];
}

// Dasha sub-period
export interface PdfAntarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
  pratyantars?: PdfPratyantarDasha[];
}

export interface PdfPratyantarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
}

// Dasha period
export interface PdfDashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed?: {
    years: number;
    months: number;
    days: number;
  };
  remaining?: {
    years: number;
    months: number;
    days: number;
  };
  antardashas?: PdfAntarDasha[];
}

// Varga chart data for PDF
export interface PdfVargaPlanet {
  id: string;
  name: string;
  house: number;
  vargaSign: number;
  vargaDegree: number;
  retrograde: boolean;
}

export interface PdfVargaChart {
  id: string;
  name: string;
  planets: PdfVargaPlanet[];
  ascendantSign: number;
}

// Full chart data for PDF
export interface PdfVedicChartData {
  ascendant: number;
  ascendantNakshatra: PdfNakshatraInfo;
  planets: PdfPlanet[];
  houses: PdfHouse[];
  moonNakshatra: string;
  lunarDay: number;
  dashas?: {
    current: PdfDashaPeriod;
    sequence: PdfDashaPeriod[];
  };
  vargas?: PdfVargaChart[];
}

// User birth data
export interface PdfBirthData {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
}

// Main PDF data prop
export interface PdfReportData {
  chartData: PdfVedicChartData;
  birthData?: PdfBirthData | null;
  // Pre-rendered chart images as base64
  mainChartImage?: string;
  vargaChartImages?: Record<string, string>;
}
