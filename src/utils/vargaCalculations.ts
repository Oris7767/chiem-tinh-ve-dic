/**
 * Varga Calculations Utility
 * Các hàm tính toán lá số phụ (Divisional Charts) dựa trên kinh độ thiên văn
 * 
 * Sign numbering (Vedic - 0-based):
 * 0: Aries (Bạch Dương)
 * 1: Taurus (Kim Ngưu)
 * 2: Gemini (Song Tử)
 * 3: Cancer (Cự Giải)
 * 4: Leo (Sư Tử)
 * 5: Virgo (Xử Nữ)
 * 6: Libra (Thiên Xứng)
 * 7: Scorpio (Thiên Yết)
 * 8: Sagittarius (Nhân Mã)
 * 9: Capricorn (Ma Kết)
 * 10: Aquarius (Bảo Bình)
 * 11: Pisces (Song Ngư)
 */

/**
 * Hàm hỗ trợ lấy số cung và độ trong cung từ kinh độ
 * @param longitude - Kinh độ thiên văn (0-360 độ)
 * @returns Object chứa sign (0-11) và degreeInSign (0-29.99)
 */
export const getBaseSignAndDegree = (longitude: number) => {
  const sign = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  return { sign, degreeInSign };
};

/**
 * D2 - Hora (Tài lộc)
 * Chia cung làm 2 phần (15 độ mỗi phần)
 * - Odd signs (0, 2, 4, 6, 8, 10): 0-15° ở Leo (4), 15-30° ở Cancer (3)
 * - Even signs (1, 3, 5, 7, 9, 11): 0-15° ở Cancer (3), 15-30° ở Leo (4)
 */
export const calculateD2Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const isOddSign = sign % 2 === 0; // 0, 2, 4, 6, 8, 10 là odd trong Vedic
  const isFirstHalf = degreeInSign < 15;
  
  if (isOddSign) return isFirstHalf ? 4 : 3;
  return isFirstHalf ? 3 : 4;
};

/**
 * D3 - Drekkana (Anh chị em/Hành động)
 * Chia cung làm 3 phần (10 độ mỗi phần)
 * - Phần 1 (0-10°): Cùng cung gốc
 * - Phần 2 (10-20°): Cung thứ 5 từ nó ((sign + 4) % 12)
 * - Phần 3 (20-30°): Cung thứ 9 từ nó ((sign + 8) % 12)
 */
export const calculateD3Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 10); // 0, 1, 2
  
  if (part === 0) return sign;
  if (part === 1) return (sign + 4) % 12; // 5th house
  return (sign + 8) % 12; // 9th house
};

/**
 * D9 - Navamsa (Hôn nhân/Tiềm năng cốt lõi)
 * Chia cung làm 9 phần (3°20' = 10/3 độ mỗi phần)
 * 
 * Mỗi nhóm nguyên tố bắt đầu từ một cung cụ thể:
 * - Nhóm Lửa (Fire): Aries, Leo, Sagittarius -> bắt đầu từ Aries (0)
 * - Nhóm Đất (Earth): Taurus, Virgo, Capricorn -> bắt đầu từ Capricorn (9)
 * - Nhóm Khí (Air): Gemini, Libra, Aquarius -> bắt đầu từ Libra (6)
 * - Nhóm Thủy (Water): Cancer, Scorpio, Pisces -> bắt đầu từ Cancer (3)
 */
export const calculateD9Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  
  // Navamsa part: 0-8 (mỗi phần 10/3 độ)
  const navamsaPart = Math.floor(degreeInSign / (10 / 3));
  
  // Xác định nhóm nguyên tố và startSign
  let startSign = 0;
  const elementGroup = sign % 4; // 0: Fire, 1: Earth, 2: Air, 3: Water
  
  if (elementGroup === 0) startSign = 0;      // Fire: Aries (0)
  else if (elementGroup === 1) startSign = 9; // Earth: Capricorn (9)
  else if (elementGroup === 2) startSign = 6; // Air: Libra (6)
  else if (elementGroup === 3) startSign = 3; // Water: Cancer (3)
  
  return (startSign + navamsaPart) % 12;
};

/**
 * D10 - Dasamsa (Sự nghiệp)
 * Chia cung làm 10 phần (3 độ mỗi phần)
 * 
 * - Odd signs (0, 2, 4, 6, 8, 10): đếm thuận từ cung gốc (sign + part) % 12
 * - Even signs (1, 3, 5, 7, 9, 11): bắt đầu từ cung thứ 9 và đếm thuận (sign + 8 + part) % 12
 */
export const calculateD10Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 3);
  
  const isOddSign = sign % 2 === 0;
  
  if (isOddSign) {
    return (sign + part) % 12;
  }
  // Even signs: bắt đầu từ cung thứ 9 và đếm thuận
  return (sign + 8 + part) % 12;
};

/**
 * D12 - Dwadamsa (Cha mẹ)
 * Chia cung làm 12 phần (2.5 độ mỗi phần)
 */
export const calculateD12Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 2.5);
  
  return (sign + part) % 12;
};

/**
 * D4 - Chaturthamsa (May mắn/Tài sản)
 * Chia 4 phần (7.5 độ). Bắt đầu từ: Cung hiện tại, Cung thứ 4, Cung thứ 7, Cung thứ 10.
 */
export const calculateD4Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 7.5);
  return (sign + part * 3) % 12;
};

/**
 * D7 - Saptamsa (Con cái)
 * Chia 7 phần (~4.28 độ).
 * Cung lẻ: đếm từ chính nó. Cung chẵn: đếm từ cung đối diện (cung thứ 7).
 */
export const calculateD7Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / (30 / 7));
  const isOddSign = sign % 2 === 0;
  return (isOddSign ? sign + part : sign + 6 + part) % 12;
};

/**
 * D16 - Shodasamsa (Xe cộ/Phúc lộc)
 * Chia 16 phần (1.875 độ).
 * Moveable signs (0,3,6,9): từ Aries(0). Fixed (1,4,7,10): từ Leo(4). Dual (2,5,8,11): từ Sag(8).
 */
export const calculateD16Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 1.875);
  const modality = sign % 3; // 0: Moveable, 1: Fixed, 2: Dual

  let startSign = 0;
  if (modality === 0) startSign = 0;
  else if (modality === 1) startSign = 4;
  else if (modality === 2) startSign = 8;

  return (startSign + part) % 12;
};

/**
 * D20 - Vimsamsa (Tâm linh/Đạo đức)
 * Chia 20 phần (1.5 độ).
 * Moveable: từ Aries(0). Fixed: từ Sag(8). Dual: từ Leo(4).
 */
export const calculateD20Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 1.5);
  const modality = sign % 3;

  let startSign = 0;
  if (modality === 0) startSign = 0;
  else if (modality === 1) startSign = 8;
  else if (modality === 2) startSign = 4;

  return (startSign + part) % 12;
};

/**
 * D24 - Siddhamsa (Học vấn)
 * Chia 24 phần (1.25 độ). Cung lẻ: từ Leo(4). Cung chẵn: từ Cancer(3).
 */
export const calculateD24Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 1.25);
  const isOddSign = sign % 2 === 0;
  return ((isOddSign ? 4 : 3) + part) % 12;
};

/**
 * D27 - Bhamsa/Nakshatramsa (Năng lực/Sức mạnh tiềm thức)
 * Chia 27 phần (~1.11 độ). Moveable: từ Aries(0). Fixed: từ Cancer(3). Dual: từ Libra(6).
 */
export const calculateD27Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / (30 / 27));
  const modality = sign % 3;

  let startSign = 0;
  if (modality === 0) startSign = 0;
  else if (modality === 1) startSign = 3;
  else if (modality === 2) startSign = 6;

  return (startSign + part) % 12;
};

/**
 * D30 - Trimsamsa (Tai họa/Nghiệp quả)
 * KHÔNG CHIA ĐỀU. Cung Lẻ và Cung Chẵn có số độ bất đối xứng được gán cho 5 hành tinh.
 */
export const calculateD30Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const isOddSign = sign % 2 === 0;
  const d = degreeInSign;

  if (isOddSign) {
    if (d < 5) return 0;       // Aries (Mars)
    if (d < 10) return 10;     // Aquarius (Saturn)
    if (d < 18) return 8;      // Sagittarius (Jupiter)
    if (d < 25) return 2;      // Gemini (Mercury)
    return 6;                  // Libra (Venus)
  } else {
    if (d < 5) return 1;       // Taurus (Venus)
    if (d < 12) return 5;      // Virgo (Mercury)
    if (d < 20) return 11;     // Pisces (Jupiter)
    if (d < 25) return 9;      // Capricorn (Saturn)
    return 7;                  // Scorpio (Mars)
  }
};

/**
 * D40 - Khavedamsa (Phúc họa vĩ mô)
 * Chia 40 phần (0.75 độ). Cung lẻ: từ Aries(0). Cung chẵn: từ Libra(6).
 */
export const calculateD40Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / 0.75);
  const isOddSign = sign % 2 === 0;
  return ((isOddSign ? 0 : 6) + part) % 12;
};

/**
 * D45 - Akshavedamsa (Tổng thể nhân cách)
 * Chia 45 phần (~0.66 độ). Moveable: từ Aries(0). Fixed: từ Leo(4). Dual: từ Sag(8).
 */
export const calculateD45Sign = (longitude: number): number => {
  const { sign, degreeInSign } = getBaseSignAndDegree(longitude);
  const part = Math.floor(degreeInSign / (30 / 45));
  const modality = sign % 3;

  let startSign = 0;
  if (modality === 0) startSign = 0;
  else if (modality === 1) startSign = 4;
  else if (modality === 2) startSign = 8;

  return (startSign + part) % 12;
};

/**
 * Tính toán tất cả Vargas từ D1 chart data
 * @param planets - Mảng các planet từ D1
 * @param ascendantLongitude - Kinh độ Cung Mọc từ D1
 * @returns Object chứa các mảng planets và ascendantSign cho mỗi divisional chart
 */
export interface PlanetInput {
  id: string;
  name: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde?: boolean;
}

export interface PlanetVarga {
  id: string;
  name: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
  // Varga-specific fields
  vargaSign: number;
  vargaDegree: number;
}

export interface VargaChartData {
  planets: PlanetVarga[];
  ascendantSign: number; // Cung Mọc của lá số Varga này
}

export interface VargaCharts {
  D1: VargaChartData;
  D2: VargaChartData;
  D3: VargaChartData;
  D4: VargaChartData;
  D7: VargaChartData;
  D9: VargaChartData;
  D10: VargaChartData;
  D12: VargaChartData;
  D16: VargaChartData;
  D20: VargaChartData;
  D24: VargaChartData;
  D27: VargaChartData;
  D30: VargaChartData;
  D40: VargaChartData;
  D45: VargaChartData;
}

// Công thức tính số Nhà (1-12) trong chiêm tinh Vệ Đà
const calculateHouse = (planetSign: number, ascendantSign: number): number => {
  return ((planetSign - ascendantSign + 12) % 12) + 1;
};

export const calculateAllVargas = (
  planets: PlanetInput[],
  ascendantLongitude: number
): VargaCharts => {
  
  // Tính D1
  const d1AscendantSign = getBaseSignAndDegree(ascendantLongitude).sign;
  const d1Planets: PlanetVarga[] = planets.map(planet => ({
    id: planet.id,
    name: planet.name,
    longitude: planet.longitude,
    house: planet.house,
    sign: planet.sign,
    retrograde: planet.retrograde || false,
    vargaSign: planet.sign,
    vargaDegree: planet.longitude % 30,
  }));

  const toVargaChart = (
    planets: PlanetInput[],
    calculator: (longitude: number) => number,
    ascendantLong: number
  ): VargaChartData => {
    // 1. Tính Cung Mọc mới cho lá số Varga
    const newAscendantSign = calculator(ascendantLong);

    // 2. Tính cung mới và Nhà mới cho các hành tinh
    const vargaPlanets: PlanetVarga[] = planets.map(planet => {
      const vargaSign = calculator(planet.longitude);
      const { degreeInSign } = getBaseSignAndDegree(planet.longitude);
      
      return {
        id: planet.id,
        name: planet.name,
        longitude: (vargaSign * 30) + 15, // Đặt vào giữa cung mới để UI vẽ
        sign: vargaSign,
        house: calculateHouse(vargaSign, newAscendantSign), // GHI ĐÈ SỐ NHÀ MỚI
        retrograde: planet.retrograde || false,
        vargaSign,
        vargaDegree: degreeInSign,
      };
    });

    return {
      planets: vargaPlanets,
      ascendantSign: newAscendantSign
    };
  };

  return {
    D1: { planets: d1Planets, ascendantSign: d1AscendantSign },
    D2: toVargaChart(planets, calculateD2Sign, ascendantLongitude),
    D3: toVargaChart(planets, calculateD3Sign, ascendantLongitude),
    D4: toVargaChart(planets, calculateD4Sign, ascendantLongitude),
    D7: toVargaChart(planets, calculateD7Sign, ascendantLongitude),
    D9: toVargaChart(planets, calculateD9Sign, ascendantLongitude),
    D10: toVargaChart(planets, calculateD10Sign, ascendantLongitude),
    D12: toVargaChart(planets, calculateD12Sign, ascendantLongitude),
    D16: toVargaChart(planets, calculateD16Sign, ascendantLongitude),
    D20: toVargaChart(planets, calculateD20Sign, ascendantLongitude),
    D24: toVargaChart(planets, calculateD24Sign, ascendantLongitude),
    D27: toVargaChart(planets, calculateD27Sign, ascendantLongitude),
    D30: toVargaChart(planets, calculateD30Sign, ascendantLongitude),
    D40: toVargaChart(planets, calculateD40Sign, ascendantLongitude),
    D45: toVargaChart(planets, calculateD45Sign, ascendantLongitude),
  };
};
