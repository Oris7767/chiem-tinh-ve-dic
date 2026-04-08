import {
  BRANCHES,
  STEMS,
  MONTH_TUONGS,
  STEM_KY_CUNG,
  EarthBranch,
  HeavenlyStem,
  isKhacByFiveElement,
  isTặcByFiveElement,
  isTyiHoaByYinYang,
} from '@/data/lucNham';
import {
  LucNhamPurpose,
  PURPOSE_INTERPRETATIONS,
} from '@/data/lucNham/interpretations';

type FourKhoaItem = {
  upper: EarthBranch;
  lower: EarthBranch;
  label: 'K1' | 'K2' | 'K3' | 'K4';
};

export type LucNhamDayResult = {
  isoDate: string;
  day: number;
  dayCan: HeavenlyStem;
  dayChi: EarthBranch;
  soTruyen: EarthBranch;
  trungTruyen: EarthBranch;
  matTruyen: EarthBranch;
  isGood: boolean;
  reason: string;
};

const MẠNH = new Set<EarthBranch>(['Dần', 'Thân', 'Tỵ', 'Hợi']);
const TRỌNG = new Set<EarthBranch>(['Tý', 'Ngọ', 'Mão', 'Dậu']);

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function julianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

function getDayCanChi(date: Date): { can: HeavenlyStem; chi: EarthBranch } {
  // Reference cycle anchor (widely used): 1984-02-02 = Giáp Tý day.
  const base = new Date(1984, 1, 2);
  const diff = julianDay(date) - julianDay(base);
  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;
  return { can: STEMS[stemIndex], chi: BRANCHES[branchIndex] };
}

function getYearBranch(date: Date): EarthBranch {
  // 1984 = Giáp Tý year => index 0 at Tý
  const offset = date.getFullYear() - 1984;
  const idx = ((offset % 12) + 12) % 12;
  return BRANCHES[idx];
}

function rotateFrom<T>(arr: T[], startValue: T): T[] {
  const startIdx = arr.indexOf(startValue);
  if (startIdx < 0) return [...arr];
  return [...arr.slice(startIdx), ...arr.slice(0, startIdx)];
}

function buildHeavenBoard(monthTuoBranch: EarthBranch, hourBranch: EarthBranch): Record<EarthBranch, EarthBranch> {
  // Place “Nguyệt tướng” on the selected hour branch, then run sequentially through 12 chi.
  const rotatedHeaven = rotateFrom(BRANCHES, monthTuoBranch);
  const hourIdx = BRANCHES.indexOf(hourBranch);
  const board: Partial<Record<EarthBranch, EarthBranch>> = {};
  for (let i = 0; i < 12; i += 1) {
    const earth = BRANCHES[(hourIdx + i) % 12];
    board[earth] = rotatedHeaven[i];
  }
  return board as Record<EarthBranch, EarthBranch>;
}

function priorityBucket(branch: EarthBranch): number {
  if (MẠNH.has(branch)) return 3;
  if (TRỌNG.has(branch)) return 2;
  return 1; // Quý
}

function buildFourKhoa(
  board: Record<EarthBranch, EarthBranch>,
  dayCan: HeavenlyStem,
  dayChi: EarthBranch
): FourKhoaItem[] {
  const canBase = STEM_KY_CUNG[dayCan];
  const k1Upper = board[canBase];
  const k2Upper = board[k1Upper];
  const k3Upper = board[dayChi];
  const k4Upper = board[k3Upper];

  return [
    { label: 'K1', upper: k1Upper, lower: canBase },
    { label: 'K2', upper: k2Upper, lower: k1Upper },
    { label: 'K3', upper: k3Upper, lower: dayChi },
    { label: 'K4', upper: k4Upper, lower: k3Upper },
  ];
}

function pickSoTruyen(khoa: FourKhoaItem[], dayCan: HeavenlyStem): EarthBranch {
  const tacList = khoa.filter((k) => isTặcByFiveElement(k.lower, k.upper));
  const khacList = khoa.filter((k) => isKhacByFiveElement(k.upper, k.lower));

  const pickFrom = (list: FourKhoaItem[]): EarthBranch | null => {
    if (list.length === 0) return null;
    if (list.length === 1) return list[0].upper;

    const tyHoa = list.filter((k) => isTyiHoaByYinYang(k.upper, dayCan));
    const pool = tyHoa.length > 0 ? tyHoa : list;
    pool.sort((a, b) => priorityBucket(b.upper) - priorityBucket(a.upper));
    return pool[0].upper;
  };

  return pickFrom(tacList) ?? pickFrom(khacList) ?? khoa[2].upper;
}

function getMessage(purpose: LucNhamPurpose, isGood: boolean, day: number): string {
  const lib = PURPOSE_INTERPRETATIONS[purpose];
  const source = isGood ? lib.good : lib.bad;
  return source[day % source.length];
}

function evaluateForXuatHanh(input: {
  so: EarthBranch;
  trung: EarthBranch;
  mat: EarthBranch;
  dayChi: EarthBranch;
  birthYearChi: EarthBranch;
}): boolean {
  const { so, trung, mat, dayChi, birthYearChi } = input;

  // Heuristic scoring based on movement-friendly / conflict branches.
  let score = 0;
  const trio = [so, trung, mat];
  if (trio.includes('Dần') || trio.includes('Thân')) score += 2; // Dịch mã nhóm
  if (trio.includes('Hợi') || trio.includes('Tý')) score -= 1; // conservative risk flag
  if (dayChi === birthYearChi) score -= 1;
  if (dayChi === so || dayChi === trung) score += 1;

  return score >= 1;
}

export function buildThirtyDayForecast(params: {
  year: number;
  month: number; // 1-12
  purpose: LucNhamPurpose;
  birthDate: string; // yyyy-mm-dd
}): LucNhamDayResult[] {
  const { year, month, purpose, birthDate } = params;
  const safeMonth = Math.max(1, Math.min(12, month));
  const monthTuo = MONTH_TUONGS[(safeMonth - 1) % MONTH_TUONGS.length].branch;
  const hourBranch: EarthBranch = 'Ngọ';
  const board = buildHeavenBoard(monthTuo, hourBranch);
  const birthYearChi = getYearBranch(new Date(birthDate));

  const result: LucNhamDayResult[] = [];
  for (let day = 1; day <= 30; day += 1) {
    const date = new Date(year, safeMonth - 1, day);
    const { can, chi } = getDayCanChi(date);
    const khoa = buildFourKhoa(board, can, chi);
    const so = pickSoTruyen(khoa, can);
    const trung = board[so];
    const mat = board[trung];

    const isGood = evaluateForXuatHanh({
      so,
      trung,
      mat,
      dayChi: chi,
      birthYearChi,
    });

    result.push({
      isoDate: toIsoDate(date),
      day,
      dayCan: can,
      dayChi: chi,
      soTruyen: so,
      trungTruyen: trung,
      matTruyen: mat,
      isGood,
      reason: getMessage(purpose, isGood, day),
    });
  }

  return result;
}

