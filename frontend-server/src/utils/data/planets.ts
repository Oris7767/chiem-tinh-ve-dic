export type PlanetInfo = {
    id: string;
    name: string;
    sanskritName: string;
    symbol: string;
    color: string;
    element: string;
    gender: 'Male' | 'Female' | 'Neutral';
    nature: string[];
    signRuler: number[];  // Các cung mà hành tinh cai quản (0-11)
    exaltation: number;   // Cung hành tinh được vượng (0-11)
    debilitation: number; // Cung hành tinh bị suy (0-11)
    characteristics: string[];
    keywords: string[];
    // Thêm các trường khác từ file Planet.txt
  };
  export const PLANET_COLORS = {
    SUN: '#FFA500',      // Orange
    MOON: '#SILVER',     // Silver
    MARS: '#FF0000',     // Red
    MERCURY: '#00FF00',  // Green
    JUPITER: '#FFFF00',  // Yellow
    VENUS: '#FFFFFF',    // White
    SATURN: '#000080',   // Navy Blue
    RAHU: '#4B0082',     // Indigo
    KETU: '#800000',     // Maroon
  } as const;

  export const planets: PlanetInfo[] = [
    SUN: {
        id: 'sun',
        name: 'Sun',
        sanskritName: 'Surya',
        symbol: '☉',
        color: PLANET_COLORS.SUN,
        element: 'Fire',
        gender: 'Male',
        nature: ['Hot', 'Dry', 'Fixed', 'Positive'],
        signRuler: [4], // Leo
        exaltation: 0,  // Aries
        debilitation: 6, // Libra
        characteristics: [
          'Authority',
          'Power',
          'Leadership',
          'Vitality',
          'Self-expression'
        ],
        keywords: ['Soul', 'Father', 'Government', 'Status', 'Honor']
      },
    
      MOON: {
        id: 'moon',
        name: 'Moon',
        sanskritName: 'Chandra',
        symbol: '☽',
        color: PLANET_COLORS.MOON,
        element: 'Water',
        gender: 'Female',
        nature: ['Cool', 'Moist', 'Changeable', 'Receptive'],
        signRuler: [3], // Cancer
        exaltation: 1,  // Taurus
        debilitation: 7, // Scorpio
        characteristics: [
          'Emotions',
          'Intuition',
          'Nurturing',
          'Adaptability',
          'Memory'
        ],
        keywords: ['Mind', 'Mother', 'Public', 'Home', 'Comfort']
      },
    
      MARS: {
        id: 'mars',
        name: 'Mars',
        sanskritName: 'Mangala',
        symbol: '♂',
        color: PLANET_COLORS.MARS,
        element: 'Fire',
        gender: 'Male',
        nature: ['Hot', 'Dry', 'Active', 'Aggressive'],
        signRuler: [0, 7], // Aries and Scorpio
        exaltation: 9,     // Capricorn
        debilitation: 3,   // Cancer
        characteristics: [
          'Energy',
          'Courage',
          'Action',
          'Drive',
          'Competition'
        ],
        keywords: ['Brothers', 'Strength', 'Property', 'Combat', 'Surgery']
      },
    
      MERCURY: {
        id: 'mercury',
        name: 'Mercury',
        sanskritName: 'Budha',
        symbol: '☿',
        color: PLANET_COLORS.MERCURY,
        element: 'Earth',
        gender: 'Neutral',
        nature: ['Variable', 'Adaptable', 'Quick', 'Dual'],
        signRuler: [2, 5], // Gemini and Virgo
        exaltation: 5,     // Virgo
        debilitation: 11,  // Pisces
        characteristics: [
          'Communication',
          'Intelligence',
          'Analysis',
          'Learning',
          'Trade'
        ],
        keywords: ['Speech', 'Business', 'Writing', 'Mathematics', 'Youth']
      },
    
      JUPITER: {
        id: 'jupiter',
        name: 'Jupiter',
        sanskritName: 'Guru',
        symbol: '♃',
        color: PLANET_COLORS.JUPITER,
        element: 'Ether',
        gender: 'Male',
        nature: ['Warm', 'Moist', 'Expansive', 'Benevolent'],
        signRuler: [8, 11], // Sagittarius and Pisces
        exaltation: 3,      // Cancer
        debilitation: 9,    // Capricorn
        characteristics: [
          'Wisdom',
          'Growth',
          'Abundance',
          'Teaching',
          'Spirituality'
        ],
        keywords: ['Knowledge', 'Children', 'Religion', 'Fortune', 'Guidance']
      },
    
      VENUS: {
        id: 'venus',
        name: 'Venus',
        sanskritName: 'Shukra',
        symbol: '♀',
        color: PLANET_COLORS.VENUS,
        element: 'Water',
        gender: 'Female',
        nature: ['Cool', 'Moist', 'Pleasant', 'Harmonious'],
        signRuler: [1, 6], // Taurus and Libra
        exaltation: 11,    // Pisces
        debilitation: 5,   // Virgo
        characteristics: [
          'Love',
          'Beauty',
          'Pleasure',
          'Artistry',
          'Relationships'
        ],
        keywords: ['Marriage', 'Luxury', 'Comfort', 'Vehicle', 'Entertainment']
      },
    
      SATURN: {
        id: 'saturn',
        name: 'Saturn',
        sanskritName: 'Shani',
        symbol: '♄',
        color: PLANET_COLORS.SATURN,
        element: 'Air',
        gender: 'Neutral',
        nature: ['Cold', 'Dry', 'Heavy', 'Restrictive'],
        signRuler: [9, 10], // Capricorn and Aquarius
        exaltation: 6,      // Libra
        debilitation: 0,    // Aries
        characteristics: [
          'Discipline',
          'Responsibility',
          'Limitations',
          'Time',
          'Karma'
        ],
        keywords: ['Longevity', 'Service', 'Grief', 'Delay', 'Labor']
      },
    
      RAHU: {
        id: 'rahu',
        name: 'Rahu',
        sanskritName: 'Rahu',
        symbol: '☊',
        color: PLANET_COLORS.RAHU,
        element: 'Air',
        gender: 'Male',
        nature: ['Shadowy', 'Deceptive', 'Innovative', 'Materialistic'],
        signRuler: [],      // No rulership
        exaltation: 2,      // Gemini
        debilitation: 8,    // Sagittarius
        characteristics: [
          'Illusion',
          'Obsession',
          'Transformation',
          'Foreign matters',
          'Technology'
        ],
        keywords: ['Manipulation', 'Ambition', 'Confusion', 'Innovation', 'Foreign']
      },
    
      KETU: {
        id: 'ketu',
        name: 'Ketu',
        sanskritName: 'Ketu',
        symbol: '☋',
        color: PLANET_COLORS.KETU,
        element: 'Fire',
        gender: 'Male',
        nature: ['Spiritual', 'Detached', 'Mysterious', 'Enlightening'],
        signRuler: [],      // No rulership
        exaltation: 8,      // Sagittarius
        debilitation: 2,    // Gemini
        characteristics: [
          'Spirituality',
          'Liberation',
          'Past life',
          'Moksha',
          'Enlightenment'
        ],
        keywords: ['Liberation', 'Psychic', 'Isolation', 'Meditation', 'Loss']
      }
    };
    
    // Helper functions
    export const getPlanetColor = (planetName: string): string => {
      return PLANETS[planetName.toUpperCase()]?.color || '#000000';
    };
    
    export const getPlanetSymbol = (planetName: string): string => {
      return PLANETS[planetName.toUpperCase()]?.symbol || '?';
    };
    
    export const getPlanetAbbr = (planetName: string): string => {
      return planetName.substring(0, 2).toUpperCase();
    };
    
    // Các hằng số hữu ích khác
    export const NATURAL_BENEFICS = ['JUPITER', 'VENUS', 'MOON'];
    export const NATURAL_MALEFICS = ['SATURN', 'MARS', 'SUN', 'RAHU', 'KETU'];
    export const FAST_MOVING_PLANETS = ['MOON', 'MERCURY', 'VENUS', 'SUN', 'MARS'];
    export const SLOW_MOVING_PLANETS = ['JUPITER', 'SATURN', 'RAHU', 'KETU'];
    
    // Functional types
    export type PlanetName = keyof typeof PLANETS;
    export type PlanetColor = typeof PLANET_COLORS[keyof typeof PLANET_COLORS];
    
    // Utility functions
    export const isPlanetBenefic = (planetName: string): boolean => {
      return NATURAL_BENEFICS.includes(planetName.toUpperCase());
    };
    
    export const isPlanetMalefic = (planetName: string): boolean => {
      return NATURAL_MALEFICS.includes(planetName.toUpperCase());
    };
    
    export const getPlanetDignity = (planetName: string, signPosition: number): string => {
      const planet = PLANETS[planetName.toUpperCase()];
      if (!planet) return 'neutral';
    
      if (signPosition === planet.exaltation) return 'exalted';
      if (signPosition === planet.debilitation) return 'debilitated';
      if (planet.signRuler.includes(signPosition)) return 'own sign';
      
      return 'neutral';
    }// Sao chép nội dung từ Planet.txt vào đây
]
