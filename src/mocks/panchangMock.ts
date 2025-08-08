import { PanchangData } from '../services/panchangService';

export const mockPanchangData: PanchangData = {
  date: new Date().toISOString(),
  lunarDay: 11,
  lunarMonth: 2,
  lunarYear: 2024,
  sunriseTime: "06:15:00",
  sunsetTime: "18:20:00",
  moonriseTime: "14:30:00",
  moonsetTime: "03:45:00",
  tithi: "Ekadashi",
  nakshatra: "Rohini",
  yoga: "Siddha",
  karana: "Bava",
  recentTransits: [
    {
      planet: "Mars",
      fromSign: "Scorpio",
      toSign: "Sagittarius",
      date: "2024-02-10",
      time: "15:30:00"
    },
    {
      planet: "Venus",
      fromSign: "Capricorn",
      toSign: "Aquarius",
      date: "2024-02-08",
      time: "09:45:00"
    },
    {
      planet: "Mercury",
      fromSign: "Sagittarius",
      toSign: "Capricorn",
      date: "2024-02-05",
      time: "12:20:00"
    }
  ]
};

// Vietnamese version of the names for testing localization
export const viPanchangNames = {
  tithi: {
    "Ekadashi": "Thập Nhất",
    "Dvadashi": "Thập Nhị",
    "Trayodashi": "Thập Tam",
    // Add more mappings as needed
  },
  nakshatra: {
    "Rohini": "Thiên Cơ",
    "Mrigashira": "Thiên Tướng",
    "Ardra": "Thiên Tâm",
    // Add more mappings as needed
  },
  yoga: {
    "Siddha": "Thành Tựu",
    "Vyatipata": "Nghịch Lưu",
    "Variyan": "Thăng Tiến",
    // Add more mappings as needed
  },
  karana: {
    "Bava": "Sinh Khí",
    "Balava": "Thiên Tài",
    "Kaulava": "Địa Lợi",
    // Add more mappings as needed
  },
  planets: {
    "Mars": "Sao Hỏa",
    "Venus": "Sao Kim",
    "Mercury": "Sao Thủy",
    "Jupiter": "Sao Mộc",
    "Saturn": "Sao Thổ",
    "Sun": "Mặt Trời",
    "Moon": "Mặt Trăng",
    "Rahu": "La Hầu",
    "Ketu": "Kế Đô"
  },
  zodiacSigns: {
    "Aries": "Bạch Dương",
    "Taurus": "Kim Ngưu",
    "Gemini": "Song Tử",
    "Cancer": "Cự Giải",
    "Leo": "Sư Tử",
    "Virgo": "Xử Nữ",
    "Libra": "Thiên Bình",
    "Scorpio": "Bọ Cạp",
    "Sagittarius": "Nhân Mã",
    "Capricorn": "Ma Kết",
    "Aquarius": "Bảo Bình",
    "Pisces": "Song Ngư"
  }
}; 