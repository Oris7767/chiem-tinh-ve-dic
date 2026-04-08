import {
  BRANCHES,
  STEMS,
  STEM_KY_CUNG,
  EarthBranch,
  HeavenlyStem,
  isKhacByFiveElement,
  isTặcByFiveElement,
  isTyiHoaByYinYang,
  yinYangOfStem,
  getDichMa,
  getTuanKhong,
} from '@/data/lucNham';
import {
  LucNhamPurpose,
  PURPOSE_INTERPRETATIONS,
} from '@/data/lucNham/interpretations';
import {
  getHanhNien,
  getLucDieu,
  getNguHanhTuongSinh,
  getQuyNhan,
  isQuyNhanDangThienMon,
} from './lucNhamPersonalLogic';

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
  personalContext?: {
    hanhNien: EarthBranch;
    quyNhan: EarthBranch;
    isQuyNhanDangThienMon: boolean;
    lucDieu: string;
    nguHanhTuongSinh: string;
    birthCan: HeavenlyStem;
    birthChi: EarthBranch;
    birthYear: number;
    gender: 'male' | 'female';
  };
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

function getYearCanChi(date: Date): { can: HeavenlyStem; chi: EarthBranch } {
  // 1984 = Giáp Tý year
  const offset = date.getFullYear() - 1984;
  const stemIndex = ((offset % 10) + 10) % 10;
  const branchIndex = ((offset % 12) + 12) % 12;
  return { can: STEMS[stemIndex], chi: BRANCHES[branchIndex] };
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

function getOppositeBranch(branch: EarthBranch): EarthBranch {
  const idx = BRANCHES.indexOf(branch);
  return BRANCHES[(idx + 6) % 12];
}

function isPhucNgamBoard(board: Record<EarthBranch, EarthBranch>): boolean {
  return BRANCHES.every((b) => board[b] === b);
}

function isPhanNgamBoard(board: Record<EarthBranch, EarthBranch>): boolean {
  return BRANCHES.every((b) => board[b] === getOppositeBranch(b));
}

function isOpposing(a: EarthBranch, b: EarthBranch): boolean {
  return getOppositeBranch(a) === b;
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

// Placeholder: map Nguyệt tướng by Trung Khí boundaries.
// This is intentionally explicit and replaceable by an astronomic ephemeris in next iteration.
export function getNguyetTuongByTietKhi(date: Date): EarthBranch {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Rough fallback boundaries around each month's Trung Khí (typically ~20th-24th).
  // Order follows classic 12 monthly generals from the provided rules.
  if ((m === 2 && d >= 19) || (m === 3 && d < 21)) return 'Hợi'; // Vũ Thủy..Xuân Phân
  if ((m === 3 && d >= 21) || (m === 4 && d < 20)) return 'Tuất'; // Xuân Phân..Cốc Vũ
  if ((m === 4 && d >= 20) || (m === 5 && d < 21)) return 'Dậu'; // Cốc Vũ..Tiểu Mãn
  if ((m === 5 && d >= 21) || (m === 6 && d < 21)) return 'Thân'; // Tiểu Mãn..Hạ Chí
  if ((m === 6 && d >= 21) || (m === 7 && d < 23)) return 'Mùi'; // Hạ Chí..Đại Thử
  if ((m === 7 && d >= 23) || (m === 8 && d < 23)) return 'Ngọ'; // Đại Thử..Xử Thử
  if ((m === 8 && d >= 23) || (m === 9 && d < 23)) return 'Tỵ'; // Xử Thử..Thu Phân
  if ((m === 9 && d >= 23) || (m === 10 && d < 23)) return 'Thìn'; // Thu Phân..Sương Giáng
  if ((m === 10 && d >= 23) || (m === 11 && d < 22)) return 'Mão'; // Sương Giáng..Tiểu Tuyết
  if ((m === 11 && d >= 22) || (m === 12 && d < 22)) return 'Dần'; // Tiểu Tuyết..Đông Chí
  if ((m === 12 && d >= 22) || (m === 1 && d < 20)) return 'Sửu'; // Đông Chí..Đại Hàn
  return 'Tý'; // Đại Hàn..Vũ Thủy
}

function pickSoTruyen(
  khoa: FourKhoaItem[],
  dayCan: HeavenlyStem,
  dayChi: EarthBranch,
  board: Record<EarthBranch, EarthBranch>
): EarthBranch {
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

  // 1) Tặc Khắc / Tỷ Dụng
  const tacKhac = pickFrom(tacList) ?? pickFrom(khacList);
  if (tacKhac) return tacKhac;

  // 2) Phục Ngâm
  if (isPhucNgamBoard(board)) {
    return yinYangOfStem(dayCan) === 'Dương' ? khoa[0].upper : khoa[2].upper;
  }

  // 3) Phản Ngâm
  if (isPhanNgamBoard(board)) {
    return getDichMa(dayChi);
  }

  // 4) Bát Chuyên (when day-stem side and day-branch side collapse to same upper-branch)
  if (khoa[0].upper === khoa[2].upper) {
    return khoa[0].upper;
  }

  // 5) Dao Sát / Dao Khắc (remote clash cue)
  const daoSatCandidates = khoa.filter((k) => isOpposing(k.upper, k.lower));
  const daoSat = pickFrom(daoSatCandidates);
  if (daoSat) return daoSat;

  // 6) Ngang Tinh (no clash/no theft/no control)
  const hasAnyCombat =
    tacList.length > 0 || khacList.length > 0 || daoSatCandidates.length > 0;
  if (!hasAnyCombat) {
    return yinYangOfStem(dayCan) === 'Dương' ? khoa[0].upper : khoa[2].upper;
  }

  throw new Error(`Unable to determine Sơ truyền for ${dayCan} ${dayChi}`);
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
  dayCan: HeavenlyStem;
  dayChi: EarthBranch;
  birthYearChi: EarthBranch;
}): boolean {
  const { so, trung, mat, dayCan, dayChi, birthYearChi } = input;

  let score = 0;
  const trio = [so, trung, mat];
  const dichMa = getDichMa(dayChi);
  const [voidA, voidB] = getTuanKhong(dayCan, dayChi);

  if (trio.includes(dichMa)) score += 2;
  if (trio.includes(voidA) || trio.includes(voidB)) score -= 2;

  if (dayChi === birthYearChi) score -= 1;
  if (dayChi === so || dayChi === trung) score += 1;

  return score >= 1;
}

export function buildThirtyDayForecast(params: {
  year: number;
  month: number; // 1-12
  purpose: LucNhamPurpose;
  birthDate: string; // yyyy-mm-dd
  gender?: 'male' | 'female';
}): LucNhamDayResult[] {
  const { year, month, purpose, birthDate, gender = 'female' } = params;
  const birth = new Date(birthDate);
  const birthYear = birth.getFullYear();
  const birthCanChi = getYearCanChi(birth);
  const safeMonth = Math.max(1, Math.min(12, month));
  const hourBranch: EarthBranch = 'Ngọ';
  const birthYearChi = getYearBranch(birth);

  const result: LucNhamDayResult[] = [];
  for (let day = 1; day <= 30; day += 1) {
    const date = new Date(year, safeMonth - 1, day);
    const monthTuo = getNguyetTuongByTietKhi(date);
    const board = buildHeavenBoard(monthTuo, hourBranch);
    const { can, chi } = getDayCanChi(date);
    const khoa = buildFourKhoa(board, can, chi);
    const so = pickSoTruyen(khoa, can, chi, board);
    const trung = board[so];
    const mat = board[trung];

    const isGood = evaluateForXuatHanh({
      so,
      trung,
      mat,
      dayCan: can,
      dayChi: chi,
      birthYearChi,
    });
    // NOTE: lunar values are temporarily mocked from solar month/day until lunar conversion helper is added.
    const lucDieu = getLucDieu(safeMonth, day);
    const hanhNien = getHanhNien(birthYear, year, gender);
    const quyNhan = getQuyNhan(can, 'day');
    const quyNhanDangThienMon = isQuyNhanDangThienMon(can, monthTuo, 'day');
    const nguHanhTuongSinh = getNguHanhTuongSinh(can, birthCanChi.can);

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
      personalContext: {
        hanhNien,
        quyNhan,
        isQuyNhanDangThienMon: quyNhanDangThienMon,
        lucDieu,
        nguHanhTuongSinh,
        birthCan: birthCanChi.can,
        birthChi: birthCanChi.chi,
        birthYear,
        gender,
      },
    });
  }

  return result;
}

