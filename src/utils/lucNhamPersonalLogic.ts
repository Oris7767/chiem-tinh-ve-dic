import {
  BRANCHES,
  EarthBranch,
  FIVE_ELEMENT_OVERCOMES,
  HeavenlyStem,
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

