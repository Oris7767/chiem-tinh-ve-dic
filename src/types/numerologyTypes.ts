
export interface NumerologyCalculation {
  id: string;
  name: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
  birth_number: number;
  name_number: number;
  life_number: number;
  created_at: string;
  user_email: string | null;
  user_ip: string | null;
}
