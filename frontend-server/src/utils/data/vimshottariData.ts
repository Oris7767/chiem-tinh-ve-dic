export type MahaDasha = {
    planet: string;
    years: number;
    symbol: string;
  };
  
  export type VimshottariData = {
    totalYears: number;
    mahaDashas: MahaDasha[];
    // Thêm các trường khác từ file dasa.txt
  };
  
  export const vimshottariData: VimshottariData = {
    // Sao chép nội dung từ dasa.txt vào đây
    totalYears: 120,
    mahaDashas: [
      { planet: "Ketu", years: 7, symbol: "के" },
      { planet: "Venus", years: 20, symbol: "शु" },
      { planet: "Sun", years: 6, symbol: "सू" },
        { planet: "Moon", years: 10, symbol: "चं" },
        { planet: "Mars", years: 7, symbol: "मं" },
        { planet: "Rahu", years: 18, symbol: "रा" },
        { planet: "Jupiter", years: 16, symbol: "गु" },
        { planet: "Saturn", years: 19, symbol: "श" },
        { planet: "Mercury", years: 17, symbol: "बु" }
    ],

    // Antardasha percentages (relative to Mahadasha period)
    antarDashaPercentages: {
        "Ketu": [
            { planet: "Ketu", percent: 100/120 },
            { planet: "Venus", percent: 285.714/120 },
            { planet: "Sun", percent: 85.714/120 },
            { planet: "Moon", percent: 142.857/120 },
            { planet: "Mars", percent: 100/120 },
            { planet: "Rahu", percent: 257.143/120 },
            { planet: "Jupiter", percent: 228.571/120 },
            { planet: "Saturn", percent: 271.429/120 },
            { planet: "Mercury", percent: 242.857/120 }
        ],
        "Venus": [
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 }
        ],
        "Sun": [
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 }
        ],
        "Moon": [
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 }
        ],
        "Mars": [
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 }
        ],
        "Rahu": [
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 }
        ],
        "Jupiter": [
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 }
        ],
        "Saturn": [
            { planet: "Saturn", percent: 1140/120 },
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 }
        ],
        "Mercury": [
            { planet: "Mercury", percent: 1020/120 },
            { planet: "Ketu", percent: 420/120 },
            { planet: "Venus", percent: 1200/120 },
            { planet: "Sun", percent: 360/120 },
            { planet: "Moon", percent: 600/120 },
            { planet: "Mars", percent: 420/120 },
            { planet: "Rahu", percent: 1080/120 },
            { planet: "Jupiter", percent: 960/120 },
            { planet: "Saturn", percent: 1140/120 }
        ]
    },

    // Pratyantardasha calculation rules
    pratyantarDashaRules: {
        calculationMethod: "proportional",
        formula: "antarDasha_duration * bhukti_percent / 100"
    },

    // Planetary information
    planetaryInfo: {
        "Ketu": {
            sanskritName: "केतु",
            vietnameseName: "Ketu",
            element: "Fire",
            nature: "Malefic",
            gender: "Neutral",
            durationYears: 7
        },
        "Venus": {
            sanskritName: "शुक्र",
            vietnameseName: "Sao Kim",
            element: "Water",
            nature: "Benefic",
            gender: "Female",
            durationYears: 20
        },
        "Sun": {
            sanskritName: "सूर्य",
            vietnameseName: "Mặt Trời",
            element: "Fire",
            nature: "Malefic",
            gender: "Male",
            durationYears: 6
        },
        "Moon": {
            sanskritName: "चन्द्र",
            vietnameseName: "Mặt Trăng",
            element: "Water",
            nature: "Benefic",
            gender: "Female",
            durationYears: 10
        },
        "Mars": {
            sanskritName: "मंगल",
            vietnameseName: "Sao Hỏa",
            element: "Fire",
            nature: "Malefic",
            gender: "Male",
            durationYears: 7
        },
        "Rahu": {
            sanskritName: "राहु",
            vietnameseName: "Rahu",
            element: "Air",
            nature: "Malefic",
            gender: "Neutral",
            durationYears: 18
        },
        "Jupiter": {
            sanskritName: "बृहस्पति",
            vietnameseName: "Sao Mộc",
            element: "Ether",
            nature: "Benefic",
            gender: "Male",
            durationYears: 16
        },
        "Saturn": {
            sanskritName: "शनि",
            vietnameseName: "Sao Thổ",
            element: "Air",
            nature: "Malefic",
            gender: "Neutral",
            durationYears: 19
        },
        "Mercury": {
            sanskritName: "बुध",
            vietnameseName: "Sao Thủy",
            element: "Earth",
            nature: "Neutral",
            gender: "Neutral",
            durationYears: 17
        }
    },

    // Tính chất và ảnh hưởng của các Dasha
    dashaEffects: {
        Mahadasha: {
            "Ketu": "Tâm linh, giải thoát, đột phá",
            "Venus": "Nghệ thuật, tình yêu, sung túc",
            "Sun": "Quyền lực, danh tiếng, sức khỏe",
            "Moon": "Cảm xúc, tâm trí, sự nuôi dưỡng",
            "Mars": "Năng lượng, can đảm, xung đột",
            "Rahu": "Tham vọng, ảo tưởng, đổi mới",
            "Jupiter": "Trí tuệ, may mắn, phát triển",
            "Saturn": "Kỷ luật, trách nhiệm, thử thách",
            "Mercury": "Giao tiếp, kinh doanh, học tập"
        }
    },

    // Công thức tính thời gian
    timeCalculations: {
        mahadasha: "years * 12 * 30 * 24 * 60", // Chuyển đổi năm thành phút
        antardasha: "mahadasha_duration * planet_percentage",
        pratyantardasha: "antardasha_duration * planet_percentage"
    }
};

// Hàm helper để tính toán thời gian
const calculateDashaPeriod = {
    // Chuyển đổi năm thành ngày
    yearsToDays: (years) => years * 365.25,
    
    // Tính thời gian Antardasha
    getAntarDasha: (mahadashaYears, antardashaPercent) => 
        (mahadashaYears * antardashaPercent * 365.25),
    
    // Tính thời gian Pratyantardasha
    getPratyantarDasha: (antarDashaDays, pratyantarPercent) =>
        (antarDashaDays * pratyantarPercent)
};

// Ví dụ sử dụng:
// const ketu_mahadasha = vimsottariData.mahaDashas[0].years; // 7 năm
// const ketu_venus_antardasha = calculateDashaPeriod.getAntarDasha(7, 285.714/120); // Ketu-Venus

      // ...thêm các dữ liệu khác
    
  