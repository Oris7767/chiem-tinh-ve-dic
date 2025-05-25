export interface DashaPeriod {
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
  antardasha?: {
    current?: {
      planet: string;
      startDate: string;
      endDate: string;
      elapsed: {
        years: number;
        months: number;
        days: number;
      };
      remaining: {
        years: number;
        months: number;
        days: number;
      };
    };
    sequence: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      pratyantardasha?: Array<{
        planet: string;
        startDate: string;
        endDate: string;
      }>;
    }>;
  };
}

export interface Dasha {
  current: DashaPeriod;
  sequence: DashaPeriod[];
} 