// Compact, local-only Lục Nhâm (六壬) rules extracted from the provided PDFs.
// This file intentionally stores only the minimal lookup tables/constants needed by the engine.

export type HeavenlyStem =
  | 'Giáp'
  | 'Ất'
  | 'Bính'
  | 'Đinh'
  | 'Mậu'
  | 'Kỷ'
  | 'Canh'
  | 'Tân'
  | 'Nhâm'
  | 'Quý';

export type EarthBranch =
  | 'Tý'
  | 'Sửu'
  | 'Dần'
  | 'Mão'
  | 'Thìn'
  | 'Tỵ'
  | 'Ngọ'
  | 'Mùi'
  | 'Thân'
  | 'Dậu'
  | 'Tuất'
  | 'Hợi';

export type FiveElement = 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy';

export const BRANCHES: EarthBranch[] = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
];

export const STEMS: HeavenlyStem[] = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
];

// Yin/Yang of the 10 Heavenly Stems:
// Dương: 甲丙戊庚壬  => Giáp, Bính, Mậu, Canh, Nhâm
// Âm:   乙丁己辛癸  => Ất, Đinh, Kỷ, Tân, Quý
export const STEM_YIN_YANG: Record<HeavenlyStem, 'Dương' | 'Âm'> = {
  Giáp: 'Dương',
  Ất: 'Âm',
  Bính: 'Dương',
  Đinh: 'Âm',
  Mậu: 'Dương',
  Kỷ: 'Âm',
  Canh: 'Dương',
  Tân: 'Âm',
  Nhâm: 'Dương',
  Quý: 'Âm',
};

// In the PDF logic for “Tỷ Dụng Pháp”, the “tỷ hòa” step uses Âm/Dương attribute of the thần.
// We model it by branch parity:
// Dương (odd indices in BRANCHES): Tý, Dần, Thìn, Ngọ, Thân, Tuất
// Âm (even indices): Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
export const BRANCH_YIN_YANG: Record<EarthBranch, 'Dương' | 'Âm'> = {
  Tý: 'Dương',
  Sửu: 'Âm',
  Dần: 'Dương',
  Mão: 'Âm',
  Thìn: 'Dương',
  Tỵ: 'Âm',
  Ngọ: 'Dương',
  Mùi: 'Âm',
  Thân: 'Dương',
  Dậu: 'Âm',
  Tuất: 'Dương',
  Hợi: 'Âm',
};

export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  // Wood
  Giáp: 'Mộc',
  Ất: 'Mộc',
  // Fire
  Bính: 'Hỏa',
  Đinh: 'Hỏa',
  // Earth
  Mậu: 'Thổ',
  Kỷ: 'Thổ',
  // Metal
  Canh: 'Kim',
  Tân: 'Kim',
  // Water
  Nhâm: 'Thủy',
  Quý: 'Thủy',
};

export const BRANCH_ELEMENT: Record<EarthBranch, FiveElement> = {
  Tý: 'Thủy',
  Sửu: 'Thổ',
  Dần: 'Mộc',
  Mão: 'Mộc',
  Thìn: 'Thổ',
  Tỵ: 'Hỏa',
  Ngọ: 'Hỏa',
  Mùi: 'Thổ',
  Thân: 'Kim',
  Dậu: 'Kim',
  Tuất: 'Thổ',
  Hợi: 'Thủy',
};

// Khắc: Ngũ hành khắc theo chu trình
// Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc
export const FIVE_ELEMENT_OVERCOMES: Record<FiveElement, FiveElement> = {
  Mộc: 'Thổ',
  Thổ: 'Thủy',
  Thủy: 'Hỏa',
  Hỏa: 'Kim',
  Kim: 'Mộc',
};

export const STEM_KY_CUNG: Record<HeavenlyStem, EarthBranch> = {
  // “Khẩu quyết Thiên can ký cung” (trích từ PDF ấn bản 2024)
  Giáp: 'Dần',
  Ất: 'Thìn',
  Bính: 'Tỵ',
  Đinh: 'Mùi',
  Mậu: 'Tỵ',
  Kỷ: 'Mùi',
  Canh: 'Thân',
  Tân: 'Tuất',
  Nhâm: 'Hợi',
  Quý: 'Sửu',
};

export type MonthTuo = {
  name: string; // e.g. “Đăng Minh”
  branch: EarthBranch; // e.g. “Hợi”
  order: number; // 1..12
};

// “12 Nguyệt tướng” (trực ban sau Tiết ... , cung ...) — dùng để suy ra Nguyệt tướng theo lịch/tiết.
// Hiện tại engine sẽ nhận “branch” trực tiếp; mapping này giúp UI/logic về sau.
export const MONTH_TUONGS: MonthTuo[] = [
  { order: 1, name: 'Đăng Minh', branch: 'Hợi' },
  { order: 2, name: 'Hà Khôi', branch: 'Tuất' },
  { order: 3, name: 'Tòng Khôi', branch: 'Dậu' },
  { order: 4, name: 'Truyền Tống', branch: 'Thân' },
  { order: 5, name: 'Tiểu Cát', branch: 'Mùi' },
  { order: 6, name: 'Thắng Quang', branch: 'Ngọ' },
  { order: 7, name: 'Thái Ất', branch: 'Tỵ' },
  { order: 8, name: 'Thiên Cương', branch: 'Thìn' },
  { order: 9, name: 'Thái Xung', branch: 'Mão' },
  { order: 10, name: 'Công Tào', branch: 'Dần' },
  { order: 11, name: 'Đại Cát', branch: 'Sửu' },
  { order: 12, name: 'Thần Hậu', branch: 'Tý' },
];

export function yinYangOfStem(stem: HeavenlyStem): 'Dương' | 'Âm' {
  return STEM_YIN_YANG[stem];
}

export function isTyiHoaByYinYang(thần: EarthBranch, nhậtCan: HeavenlyStem): boolean {
  return BRANCH_YIN_YANG[thần] === STEM_YIN_YANG[nhậtCan];
}

export function isKhacByFiveElement(upper: EarthBranch, lower: EarthBranch): boolean {
  // Upper khắc lower in the PDF: “Thượng thần chế Hạ thần gọi là Khắc (Trên đè xuống dưới)”
  // So: element(upper) overcomes element(lower)
  const upperEl = BRANCH_ELEMENT[upper];
  const lowerEl = BRANCH_ELEMENT[lower];
  return FIVE_ELEMENT_OVERCOMES[upperEl] === lowerEl;
}

export function isTặcByFiveElement(lower: EarthBranch, upper: EarthBranch): boolean {
  // Hạ thần khắc Thượng thần gọi là Tặc (giặc dưới đánh lên)
  // So: element(lower) overcomes element(upper)
  const lowerEl = BRANCH_ELEMENT[lower];
  const upperEl = BRANCH_ELEMENT[upper];
  return FIVE_ELEMENT_OVERCOMES[lowerEl] === upperEl;
}

export function getElementOfStem(stem: HeavenlyStem): FiveElement {
  return STEM_ELEMENT[stem];
}

