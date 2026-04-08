import {
  BRANCHES,
  EarthBranch,
  FIVE_ELEMENT_OVERCOMES,
  HeavenlyStem,
  STEMS,
  STEM_ELEMENT,
} from '@/data/lucNham';

const LUC_DIEU_MAP = ['Đại An', 'Lưu Liên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Không Vong'] as const;

const QUY_NHAN_MAP: Record<HeavenlyStem, { day: EarthBranch; night: EarthBranch }> = {
  // Giáp Mậu Canh ngưu dương: Sửu / Mùi
  Giáp: { day: 'Sửu', night: 'Mùi' },
  Mậu: { day: 'Sửu', night: 'Mùi' },
  Canh: { day: 'Sửu', night: 'Mùi' },
  // Ất Kỷ thử hầu hương: Tý / Thân
  Ất: { day: 'Tý', night: 'Thân' },
  Kỷ: { day: 'Tý', night: 'Thân' },
  // Bính Đinh trư kê vị: Hợi / Dậu
  Bính: { day: 'Hợi', night: 'Dậu' },
  Đinh: { day: 'Hợi', night: 'Dậu' },
  // Nhâm Quý xà thố tàng: Tỵ / Mão
  Nhâm: { day: 'Tỵ', night: 'Mão' },
  Quý: { day: 'Tỵ', night: 'Mão' },
  // Tân phùng mã hổ phương: Ngọ / Dần
  Tân: { day: 'Ngọ', night: 'Dần' },
};

export function getLucDieu(lunarMonth: number, lunarDay: number): string {
  const idx = ((lunarMonth + lunarDay - 2) % 6 + 6) % 6;
  return LUC_DIEU_MAP[idx];
}

export function getHanhNien(
  birthYear: number,
  currentYear: number,
  gender: 'male' | 'female'
): EarthBranch {
  const tuoiMu = currentYear - birthYear + 1;
  const steps = Math.max(0, tuoiMu - 1);

  if (gender === 'male') {
    const start = BRANCHES.indexOf('Dần');
    return BRANCHES[(start + steps) % 12];
  }

  const start = BRANCHES.indexOf('Thân');
  return BRANCHES[((start - steps) % 12 + 12) % 12];
}

export function getQuyNhan(dayCan: HeavenlyStem, timeTuo: 'day' | 'night'): EarthBranch {
  return QUY_NHAN_MAP[dayCan][timeTuo];
}

export function isQuyNhanDangThienMon(
  dayCan: HeavenlyStem,
  nguyetTuong: EarthBranch,
  timeTuo: 'day' | 'night' = 'day'
): boolean {
  return getQuyNhan(dayCan, timeTuo) === nguyetTuong;
}

export function getNguHanhTuongSinh(dayCan: HeavenlyStem, birthCan: HeavenlyStem): string {
  const dayElement = STEM_ELEMENT[dayCan];
  const birthElement = STEM_ELEMENT[birthCan];

  if (dayElement === birthElement) return 'Tỷ Hòa (Bình)';
  if (FIVE_ELEMENT_OVERCOMES[dayElement] === birthElement) return 'Tương Khắc (Xấu)';
  if (FIVE_ELEMENT_OVERCOMES[birthElement] === dayElement) return 'Bị Khắc (Xấu)';

  const isDayGeneratesBirth =
    (dayElement === 'Mộc' && birthElement === 'Hỏa') ||
    (dayElement === 'Hỏa' && birthElement === 'Thổ') ||
    (dayElement === 'Thổ' && birthElement === 'Kim') ||
    (dayElement === 'Kim' && birthElement === 'Thủy') ||
    (dayElement === 'Thủy' && birthElement === 'Mộc');

  if (isDayGeneratesBirth) return 'Tương Sinh (Tốt)';
  return 'Được Sinh (Tốt)';
}

export function getYearCanChi(birthDate: string): { can: HeavenlyStem; chi: EarthBranch } {
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid birthDate: ${birthDate}`);
  }

  // In traditional calendrical practice, birth-year Ganzhi for Bazi switches at Lập Xuân.
  // Approximate Li Chun boundary at Feb 4 in local timezone.
  const y = date.getFullYear();
  const liChun = new Date(y, 1, 4, 0, 0, 0, 0);
  const effectiveYear = date < liChun ? y - 1 : y;

  const offset = effectiveYear - 1984; // 1984 = Giáp Tý
  const stemIndex = ((offset % 10) + 10) % 10;
  const branchIndex = ((offset % 12) + 12) % 12;
  return { can: STEMS[stemIndex], chi: BRANCHES[branchIndex] };
}

export type TuoiTuongTacResult = {
  status: 'Đại Hung' | 'Hung' | 'Xấu' | 'Tốt' | 'Bình';
  message: string;
};

const LUC_XUNG: Array<[EarthBranch, EarthBranch]> = [
  ['Tý', 'Ngọ'],
  ['Sửu', 'Mùi'],
  ['Dần', 'Thân'],
  ['Mão', 'Dậu'],
  ['Thìn', 'Tuất'],
  ['Tỵ', 'Hợi'],
];

const LUC_HAI: Array<[EarthBranch, EarthBranch]> = [
  ['Tý', 'Mùi'],
  ['Sửu', 'Ngọ'],
  ['Dần', 'Tỵ'],
  ['Mão', 'Thìn'],
  ['Thân', 'Hợi'],
  ['Dậu', 'Tuất'],
];

const LUC_HINH_GROUPS: EarthBranch[][] = [
  ['Dần', 'Tỵ', 'Thân'],
  ['Sửu', 'Tuất', 'Mùi'],
  ['Tý', 'Mão'],
];

const TU_HINH: EarthBranch[] = ['Thìn', 'Ngọ', 'Dậu', 'Hợi'];

function pairMatch(a: EarthBranch, b: EarthBranch, pairs: Array<[EarthBranch, EarthBranch]>): boolean {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function inSameHinhGroup(a: EarthBranch, b: EarthBranch): boolean {
  if (a === b && TU_HINH.includes(a)) return true;
  return LUC_HINH_GROUPS.some((g) => g.includes(a) && g.includes(b));
}

function isDayGeneratesBirth(dayCan: HeavenlyStem, birthCan: HeavenlyStem): boolean {
  const dayElement = STEM_ELEMENT[dayCan];
  const birthElement = STEM_ELEMENT[birthCan];
  return (
    (dayElement === 'Mộc' && birthElement === 'Hỏa') ||
    (dayElement === 'Hỏa' && birthElement === 'Thổ') ||
    (dayElement === 'Thổ' && birthElement === 'Kim') ||
    (dayElement === 'Kim' && birthElement === 'Thủy') ||
    (dayElement === 'Thủy' && birthElement === 'Mộc')
  );
}

function isBirthGeneratesDay(dayCan: HeavenlyStem, birthCan: HeavenlyStem): boolean {
  return isDayGeneratesBirth(birthCan, dayCan);
}

export function getTuoiTuongTac(
  dayCan: HeavenlyStem,
  dayChi: EarthBranch,
  birthCan: HeavenlyStem,
  birthChi: EarthBranch
): TuoiTuongTacResult {
  // 1) Chi first (stronger physical interaction)
  if (pairMatch(dayChi, birthChi, LUC_XUNG)) {
    return {
      status: 'Đại Hung',
      message: 'Địa chi Lục Xung (Rất Xấu) - Tránh làm việc lớn.',
    };
  }

  if (pairMatch(dayChi, birthChi, LUC_HAI)) {
    return {
      status: 'Hung',
      message: 'Địa chi Lục Hại (Xấu) - Dễ phát sinh trục trặc, hao tổn.',
    };
  }

  if (inSameHinhGroup(dayChi, birthChi)) {
    return {
      status: 'Hung',
      message: 'Địa chi Hình phạt (Xấu) - Đề phòng thị phi, rắc rối.',
    };
  }

  // 2) Can Ngũ Hành Sinh Khắc
  const dayElement = STEM_ELEMENT[dayCan];
  const birthElement = STEM_ELEMENT[birthCan];

  if (FIVE_ELEMENT_OVERCOMES[dayElement] === birthElement) {
    return {
      status: 'Xấu',
      message: 'Thiên can ngày khắc Can tuổi (Khắc nhập).',
    };
  }

  if (isDayGeneratesBirth(dayCan, birthCan)) {
    return {
      status: 'Tốt',
      message: 'Thiên can ngày sinh Can tuổi (Sinh nhập - Rất tốt).',
    };
  }

  if (isBirthGeneratesDay(dayCan, birthCan)) {
    return {
      status: 'Bình',
      message: 'Can tuổi sinh Can ngày (Sinh xuất - Hơi hao tổn).',
    };
  }

  if (dayElement === birthElement) {
    return {
      status: 'Bình',
      message: 'Thiên can Tỷ Hòa.',
    };
  }

  return {
    status: 'Bình',
    message: 'Không xung khắc mạnh.',
  };
}

