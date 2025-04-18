// utils/VedicAstro/Signs.ts

// Định nghĩa types cho cung hoàng đạo
export type SignInfo = {
    id: number;
    name: string;
    sanskritName: string;
    symbol: string;
    unicode: string;
    color: string;
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    quality: 'Cardinal' | 'Fixed' | 'Mutable';
    polarity: 'Positive' | 'Negative';
    direction: 'East' | 'South' | 'West' | 'North';
    ruler: string;
    degree: {
      start: number;
      end: number;
    };
    characteristics: string[];
    bodyParts: string[];
    keywords: string[];
  };
  
  // Định nghĩa màu sắc cho các cung
  export const SIGN_COLORS = {
    ARIES: '#FF4136',       // Đỏ tươi
    TAURUS: '#2ECC40',      // Xanh lá
    GEMINI: '#FFDC00',      // Vàng
    CANCER: '#SILVER',      // Bạc
    LEO: '#FF851B',         // Cam
    VIRGO: '#7FDBFF',       // Xanh da trời
    LIBRA: '#B10DC9',       // Tím
    SCORPIO: '#85144B',     // Đỏ thẫm
    SAGITTARIUS: '#FF6F61', // San hô
    CAPRICORN: '#39CCCC',   // Ngọc lam
    AQUARIUS: '#01FF70',    // Xanh neon
    PISCES: '#F012BE',      // Hồng
  } as const;
  
  // Dữ liệu chi tiết về các cung hoàng đạo
  export const SIGNS: Record<number, SignInfo> = {
    0: {
      id: 0,
      name: 'Aries',
      sanskritName: 'Mesha',
      symbol: '♈',
      unicode: '2648',
      color: SIGN_COLORS.ARIES,
      element: 'Fire',
      quality: 'Cardinal',
      polarity: 'Positive',
      direction: 'East',
      ruler: 'Mars',
      degree: {
        start: 0,
        end: 30
      },
      characteristics: [
        'Pioneering',
        'Courageous',
        'Energetic',
        'Direct',
        'Enthusiastic'
      ],
      bodyParts: ['Head', 'Face', 'Brain', 'Eyes'],
      keywords: ['Leadership', 'Initiative', 'Action', 'Beginning', 'Self']
    },
  
    1: {
      id: 1,
      name: 'Taurus',
      sanskritName: 'Vrishabha',
      symbol: '♉',
      unicode: '2649',
      color: SIGN_COLORS.TAURUS,
      element: 'Earth',
      quality: 'Fixed',
      polarity: 'Negative',
      direction: 'South',
      ruler: 'Venus',
      degree: {
        start: 30,
        end: 60
      },
      characteristics: [
        'Patient',
        'Reliable',
        'Persistent',
        'Determined',
        'Sensual'
      ],
      bodyParts: ['Neck', 'Throat', 'Thyroid gland'],
      keywords: ['Resources', 'Values', 'Stability', 'Material', 'Comfort']
    },
  
    2: {
      id: 2,
      name: 'Gemini',
      sanskritName: 'Mithuna',
      symbol: '♊',
      unicode: '264A',
      color: SIGN_COLORS.GEMINI,
      element: 'Air',
      quality: 'Mutable',
      polarity: 'Positive',
      direction: 'West',
      ruler: 'Mercury',
      degree: {
        start: 60,
        end: 90
      },
      characteristics: [
        'Versatile',
        'Communicative',
        'Witty',
        'Adaptable',
        'Intellectual'
      ],
      bodyParts: ['Arms', 'Lungs', 'Shoulders', 'Nervous system'],
      keywords: ['Communication', 'Learning', 'Connection', 'Movement', 'Variety']
    },
  
    3: {
      id: 3,
      name: 'Cancer',
      sanskritName: 'Karka',
      symbol: '♋',
      unicode: '264B',
      color: SIGN_COLORS.CANCER,
      element: 'Water',
      quality: 'Cardinal',
      polarity: 'Negative',
      direction: 'North',
      ruler: 'Moon',
      degree: {
        start: 90,
        end: 120
      },
      characteristics: [
        'Nurturing',
        'Protective',
        'Emotional',
        'Intuitive',
        'Traditional'
      ],
      bodyParts: ['Chest', 'Breasts', 'Stomach', 'Digestive system'],
      keywords: ['Home', 'Family', 'Security', 'Emotions', 'Nurturing']
    },
  
    4: {
      id: 4,
      name: 'Leo',
      sanskritName: 'Simha',
      symbol: '♌',
      unicode: '264C',
      color: SIGN_COLORS.LEO,
      element: 'Fire',
      quality: 'Fixed',
      polarity: 'Positive',
      direction: 'East',
      ruler: 'Sun',
      degree: {
        start: 120,
        end: 150
      },
      characteristics: [
        'Creative',
        'Dramatic',
        'Confident',
        'Generous',
        'Proud'
      ],
      bodyParts: ['Heart', 'Spine', 'Upper back'],
      keywords: ['Creativity', 'Expression', 'Leadership', 'Drama', 'Romance']
    },
  
    5: {
      id: 5,
      name: 'Virgo',
      sanskritName: 'Kanya',
      symbol: '♍',
      unicode: '264D',
      color: SIGN_COLORS.VIRGO,
      element: 'Earth',
      quality: 'Mutable',
      polarity: 'Negative',
      direction: 'South',
      ruler: 'Mercury',
      degree: {
        start: 150,
        end: 180
      },
      characteristics: [
        'Analytical',
        'Practical',
        'Diligent',
        'Discriminating',
        'Helpful'
      ],
      bodyParts: ['Intestines', 'Digestive system', 'Spleen'],
      keywords: ['Service', 'Health', 'Work', 'Analysis', 'Improvement']
    },
  
    6: {
      id: 6,
      name: 'Libra',
      sanskritName: 'Tula',
      symbol: '♎',
      unicode: '264E',
      color: SIGN_COLORS.LIBRA,
      element: 'Air',
      quality: 'Cardinal',
      polarity: 'Positive',
      direction: 'West',
      ruler: 'Venus',
      degree: {
        start: 180,
        end: 210
      },
      characteristics: [
        'Diplomatic',
        'Fair',
        'Cooperative',
        'Gracious',
        'Social'
      ],
      bodyParts: ['Kidneys', 'Lower back', 'Skin'],
      keywords: ['Partnership', 'Balance', 'Justice', 'Beauty', 'Harmony']
    },
  
    7: {
      id: 7,
      name: 'Scorpio',
      sanskritName: 'Vrishchika',
      symbol: '♏',
      unicode: '264F',
      color: SIGN_COLORS.SCORPIO,
      element: 'Water',
      quality: 'Fixed',
      polarity: 'Negative',
      direction: 'North',
      ruler: 'Mars',
      degree: {
        start: 210,
        end: 240
      },
      characteristics: [
        'Intense',
        'Passionate',
        'Powerful',
        'Mysterious',
        'Transformative'
      ],
      bodyParts: ['Reproductive organs', 'Excretory system'],
      keywords: ['Transformation', 'Power', 'Mystery', 'Depth', 'Regeneration']
    },
  
    8: {
      id: 8,
      name: 'Sagittarius',
      sanskritName: 'Dhanus',
      symbol: '♐',
      unicode: '2650',
      color: SIGN_COLORS.SAGITTARIUS,
      element: 'Fire',
      quality: 'Mutable',
      polarity: 'Positive',
      direction: 'East',
      ruler: 'Jupiter',
      degree: {
        start: 240,
        end: 270
      },
      characteristics: [
        'Optimistic',
        'Adventurous',
        'Philosophical',
        'Direct',
        'Expansive'
      ],
      bodyParts: ['Hips', 'Thighs', 'Liver'],
      keywords: ['Adventure', 'Philosophy', 'Travel', 'Higher learning', 'Truth']
    },
  
    9: {
      id: 9,
      name: 'Capricorn',
      sanskritName: 'Makara',
      symbol: '♑',
      unicode: '2651',
      color: SIGN_COLORS.CAPRICORN,
      element: 'Earth',
      quality: 'Cardinal',
      polarity: 'Negative',
      direction: 'South',
      ruler: 'Saturn',
      degree: {
        start: 270,
        end: 300
      },
      characteristics: [
        'Ambitious',
        'Disciplined',
        'Patient',
        'Practical',
        'Responsible'
      ],
      bodyParts: ['Bones', 'Joints', 'Knees', 'Teeth'],
      keywords: ['Achievement', 'Structure', 'Authority', 'Discipline', 'Time']
    },
  
    10: {
      id: 10,
      name: 'Aquarius',
      sanskritName: 'Kumbha',
      symbol: '♒',
      unicode: '2652',
      color: SIGN_COLORS.AQUARIUS,
      element: 'Air',
      quality: 'Fixed',
      polarity: 'Positive',
      direction: 'West',
      ruler: 'Saturn',
      degree: {
        start: 300,
        end: 330
      },
      characteristics: [
        'Progressive',
        'Original',
        'Independent',
        'Humanitarian',
        'Inventive'
      ],
      bodyParts: ['Ankles', 'Circulation', 'Electrical forces in body'],
      keywords: ['Innovation', 'Community', 'Freedom', 'Revolution', 'Vision']
    },
  
    11: {
      id: 11,
      name: 'Pisces',
      sanskritName: 'Meena',
      symbol: '♓',
      unicode: '2653',
      color: SIGN_COLORS.PISCES,
      element: 'Water',
      quality: 'Mutable',
      polarity: 'Negative',
      direction: 'North',
      ruler: 'Jupiter',
      degree: {
        start: 330,
        end: 360
      },
      characteristics: [
        'Compassionate',
        'Intuitive',
        'Artistic',
        'Gentle',
        'Musical'
      ],
      bodyParts: ['Feet', 'Lymphatic system', 'Pineal gland'],
      keywords: ['Spirituality', 'Dreams', 'Healing', 'Compassion', 'Unity']
    }
  };
  
  // Helper functions
  export const getSignColor = (signId: number): string => {
    return SIGNS[signId]?.color || '#000000';
  };
  
  export const getSignSymbol = (signId: number): string => {
    return SIGNS[signId]?.symbol || '?';
  };
  
  export const getSignByDegree = (degree: number): SignInfo => {
    const normalizedDegree = degree % 360;
    const signId = Math.floor(normalizedDegree / 30);
    return SIGNS[signId];
  };
  
  // Groupings
  export const FIRE_SIGNS = [0, 4, 8];  // Aries, Leo, Sagittarius
  export const EARTH_SIGNS = [1, 5, 9];  // Taurus, Virgo, Capricorn
  export const AIR_SIGNS = [2, 6, 10];   // Gemini, Libra, Aquarius
  export const WATER_SIGNS = [3, 7, 11];  // Cancer, Scorpio, Pisces
  
  export const CARDINAL_SIGNS = [0, 3, 6, 9];    // Aries, Cancer, Libra, Capricorn
  export const FIXED_SIGNS = [1, 4, 7, 10];      // Taurus, Leo, Scorpio, Aquarius
  export const MUTABLE_SIGNS = [2, 5, 8, 11];    // Gemini, Virgo, Sagittarius, Pisces
  
  // Utility functions
  export const getElementalNature = (signId: number): string => {
    if (FIRE_SIGNS.includes(signId)) return 'Fire';
    if (EARTH_SIGNS.includes(signId)) return 'Earth';
    if (AIR_SIGNS.includes(signId)) return 'Air';
    if (WATER_SIGNS.includes(signId)) return 'Water';
    return 'Unknown';
  };
  
  export const getQuality = (signId: number): string => {
    if (CARDINAL_SIGNS.includes(signId)) return 'Cardinal';
    if (FIXED_SIGNS.includes(signId)) return 'Fixed';
    if (MUTABLE_SIGNS.includes(signId)) return 'Mutable';
    return 'Unknown';
  };
  
  // Types for external use
  export type SignId = keyof typeof SIGNS;
  export type SignColor = typeof SIGN_COLORS[keyof typeof SIGN_COLORS];
  