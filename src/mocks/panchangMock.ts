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
  karana: "Bava"
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
  }
}; 